import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, EntityManager } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { InvoiceStatus, Plan, SubStatus } from '../types/enums';
import { Invoice, Subscription } from '../entities';
import { NormalizedEvent } from '../types/state-events';

@Injectable()
export class BillingStateService {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  private async getRequiredSubscription(
    manager: EntityManager,
    businessId: number,
    eventType: NormalizedEvent['type'],
  ): Promise<Subscription> {
    const subscription = await manager.findOne(Subscription, {
      where: { businessId },
    });

    if (!subscription) {
      throw new NotFoundException(
        `Cannot apply ${eventType}: subscription not found for business ${businessId}`,
      );
    }

    return subscription;
  }

  async applyEvent(event: NormalizedEvent): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      switch (event.type) {
        case 'subscription.activated': {
          const businessExists = await manager.findOne(Business, {
            where: { id: event.businessId },
          });
          if (!businessExists) {
            throw new NotFoundException(
              `Cannot activate subscription: business ${event.businessId} not found`,
            );
          }
          await manager.upsert(
            Subscription,
            {
              businessId: event.businessId,
              provider: event.provider,
              providerSubId: event.providerSubId,
              plan: event.plan,
              cycle: event.cycle,
              status: event.status,
              currentPeriodStart: event.periodStart,
              currentPeriodEnd: event.periodEnd,
              cancelAtPeriodEnd: false,
            },
            ['businessId'],
          );

          await manager.update(
            Business,
            { id: event.businessId },
            { plan: event.plan },
          );
          return;
        }

        case 'subscription.updated': {
          const existing = await this.getRequiredSubscription(
            manager,
            event.businessId,
            event.type,
          );

          await manager.update(
            Subscription,
            { businessId: event.businessId },
            {
              plan: event.plan,
              cycle: event.cycle,
              status: event.status,
              currentPeriodEnd: event.periodEnd,
              cancelAtPeriodEnd: event.cancelAtPeriodEnd,
            },
          );

          if (existing.plan !== event.plan) {
            await manager.update(
              Business,
              { id: event.businessId },
              { plan: event.plan },
            );
          }
          return;
        }

        case 'subscription.canceled': {
          await this.getRequiredSubscription(
            manager,
            event.businessId,
            event.type,
          );
          await manager.update(
            Subscription,
            { businessId: event.businessId },
            { cancelAtPeriodEnd: true },
          );
          return;
        }

        case 'subscription.deleted': {
          await manager.delete(Subscription, { businessId: event.businessId });
          await manager.update(
            Business,
            { id: event.businessId },
            { plan: Plan.FREE },
          );
          return;
        }

        case 'invoice.paid': {
          const sub = await this.getRequiredSubscription(
            manager,
            event.businessId,
            event.type,
          );

          await manager.upsert(
            Invoice,
            {
              subscriptionId: sub.id,
              providerInvoiceId: event.providerInvoiceId,
              amountCents: event.amountCents,
              currency: event.currency,
              status: InvoiceStatus.PAID,
              periodStart: event.periodStart,
              periodEnd: event.periodEnd,
              paidAt: event.paidAt,
              hostedUrl: event.hostedUrl,
            },
            ['providerInvoiceId'],
          );
          return;
        }

        case 'invoice.failed': {
          await this.getRequiredSubscription(
            manager,
            event.businessId,
            event.type,
          );
          await manager.update(
            Subscription,
            { businessId: event.businessId },
            { status: SubStatus.PAST_DUE },
          );
          return;
        }
      }
    });
  }
}
