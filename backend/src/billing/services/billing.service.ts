import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CANCEL_CLICKED,
  CHECKOUT_COMPLETED,
  CHECKOUT_STARTED,
  RESUME_CLICKED,
} from '../types/funnel-events';
import { BillingProviderId, Plan } from '../types/enums';
import { BillingStateService } from './billing-state.service';
import { BillingEvent, PricingPlan } from '../entities';
import { BusinessService } from '../../business/business.service';
import {
  CheckoutResponse,
  InvoiceDto,
  NormalizedEvent,
  SubscriptionSnapshot,
} from '../types/state-events';
import { CheckoutIntentDto } from '../dto';
import { PAYMENT_PROVIDER } from '../providers/payment-provider.token';
import type { PaymentProvider } from '../providers/payment-provider.interface';

@Injectable()
export class BillingService {
  constructor(
    @Inject(PAYMENT_PROVIDER) private readonly provider: PaymentProvider,
    private readonly state: BillingStateService,
    private readonly businessService: BusinessService,
    @InjectRepository(BillingEvent)
    private readonly events: Repository<BillingEvent>,
    @InjectRepository(PricingPlan)
    private readonly pricing: Repository<PricingPlan>,
  ) {}

  async startCheckout(
    ownerId: number,
    dto: CheckoutIntentDto,
  ): Promise<CheckoutResponse> {
    const businessId = await this.resolveBusinessId(ownerId);
    await this.logEvent(ownerId, businessId, CHECKOUT_STARTED, dto.plan);
    return this.provider.createCheckoutSession({
      ownerId,
      businessId,
      targetPlan: dto.plan as Exclude<Plan, Plan.FREE>,
      cycle: dto.cycle,
      returnUrl: dto.returnUrl,
    });
  }

  async confirmCheckout(ownerId: number, sessionId: string): Promise<void> {
    if (this.provider.id !== BillingProviderId.MOCK) {
      throw new BadRequestException(
        'Manual confirm only available in mock mode',
      );
    }
    const businessId = await this.resolveBusinessId(ownerId);
    const events = await this.provider.confirmCheckoutSession(
      sessionId,
      businessId,
    );
    await this.applyAll(events);
    await this.logEvent(ownerId, businessId, CHECKOUT_COMPLETED);
  }

  async getSubscription(ownerId: number): Promise<SubscriptionSnapshot | null> {
    const businessId = await this.resolveBusinessId(ownerId);
    return this.provider.getSubscription(businessId);
  }

  async listInvoices(ownerId: number, limit: number): Promise<InvoiceDto[]> {
    const businessId = await this.resolveBusinessId(ownerId);
    return this.provider.listInvoices(businessId, limit);
  }

  async cancel(ownerId: number): Promise<void> {
    const businessId = await this.resolveBusinessId(ownerId);
    const events = await this.provider.cancelSubscription(businessId);
    await this.applyAll(events);
    await this.logEvent(ownerId, businessId, CANCEL_CLICKED);
  }

  async resume(ownerId: number): Promise<void> {
    const businessId = await this.resolveBusinessId(ownerId);
    const events = await this.provider.resumeSubscription(businessId);
    await this.applyAll(events);
    await this.logEvent(ownerId, businessId, RESUME_CLICKED);
  }

  async listPricing(): Promise<
    {
      plan: Plan;
      cycle: string;
      amountCents: number;
      currency: string;
      features: string[];
    }[]
  > {
    const rows = await this.pricing.find({
      where: { active: true },
      order: { plan: 'ASC', cycle: 'ASC' } as const,
    });
    return rows.map((r) => ({
      plan: r.plan,
      cycle: r.cycle,
      amountCents: r.amountCents,
      currency: r.currency,
      features: r.features ?? [],
    }));
  }

  private async resolveBusinessId(ownerId: number): Promise<number> {
    const business = await this.businessService.findByOwnerId(ownerId);
    if (!business) throw new NotFoundException('Business not found for owner');
    return business.id;
  }

  private async logEvent(
    ownerId: number,
    businessId: number,
    eventType: string,
    targetPlan?: Plan,
  ): Promise<void> {
    await this.events.save({
      ownerId,
      businessId,
      eventType,
      targetPlan: targetPlan ?? null,
      sourceFeature: null,
      metadata: {},
    });
  }

  private async applyAll(events: NormalizedEvent[]): Promise<void> {
    for (const e of events) {
      await this.state.applyEvent(e);
    }
  }
}
