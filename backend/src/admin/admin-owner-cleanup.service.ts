import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, In } from 'typeorm';
import { Owner } from '../owner/entities/owner.entity';
import { Business } from '../business/entities/business.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Service } from '../services/entities/service.entity';
import { Subscription } from '../billing/entities/subscription.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { BillingEvent } from '../billing/entities/billing-event.entity';
import { Note } from '../notes/entities/note.entity';
import { OwnerService } from '../owner/owner.service';
import { BusinessService } from '../business/business.service';

export type OwnerCleanupResult = {
  success: true;
  deletedOwnerId: number;
  deletedBusinessId: number | null;
  counts: {
    bookings: number;
    invoices: number;
    subscriptions: number;
    billingEvents: number;
    notes: number;
  };
};

@Injectable()
export class AdminOwnerCleanupService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly ownerService: OwnerService,
    private readonly businessService: BusinessService,
  ) {}

  async cleanupByOwnerEmail(email: string): Promise<OwnerCleanupResult> {
    const owner = await this.ownerService.findByEmail(email);
    if (!owner) {
      throw new NotFoundException(`Owner with email ${email} not found`);
    }
    const business = await this.businessService.findByOwnerId(owner.id);

    return this.dataSource.transaction(async (manager) => {
      let bookings = 0;
      let invoices = 0;
      let subscriptions = 0;
      let billingEvents = 0;

      if (business) {
        // 1. Bookings — must go before services cascade-delete from business.
        // Use repository find/delete (not raw SQL subqueries) so TypeORM
        // properly quotes the camelCase "businessId" column for Postgres.
        const services = await manager.find(Service, {
          where: { businessId: business.id },
          select: { id: true },
        });
        const serviceIds = services.map((s) => s.id);

        if (serviceIds.length > 0) {
          const del = await manager.delete(Booking, {
            serviceId: In(serviceIds),
          });
          bookings = del.affected ?? 0;
        }

        // 2. Billing: invoices → subscription
        const sub = await manager.findOne(Subscription, {
          where: { businessId: business.id },
        });
        if (sub) {
          const invDel = await manager.delete(Invoice, {
            subscriptionId: sub.id,
          });
          invoices = invDel.affected ?? 0;
          const subDel = await manager.delete(Subscription, { id: sub.id });
          subscriptions = subDel.affected ?? 0;
        }

        // 3. Billing events (FK to both owner and business, no cascade)
        const beDel = await manager.delete(BillingEvent, {
          businessId: business.id,
        });
        billingEvents = beDel.affected ?? 0;
      }

      // 4. Notes (FK to owner, no cascade)
      const notesDel = await manager.delete(Note, { ownerId: owner.id });
      const notes = notesDel.affected ?? 0;

      // 5. Business — cascades Service, Schedule, Availability, Calendar, CalendarEvent
      if (business) {
        await manager.delete(Business, { id: business.id });
      }

      // 6. Owner — cascades Conversation
      await manager.delete(Owner, { id: owner.id });

      return {
        success: true,
        deletedOwnerId: owner.id,
        deletedBusinessId: business?.id ?? null,
        counts: { bookings, invoices, subscriptions, billingEvents, notes },
      };
    });
  }
}