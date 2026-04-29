import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { PaymentProvider } from '../providers/payment-provider.interface';
import { BillingProviderError, WebhookSignatureError } from '../types/errors';
import {
  CheckoutInput,
  CheckoutResponse,
  InvoiceDto,
  NormalizedEvent,
  SubscriptionSnapshot,
} from '../types/state-events';
import { Invoice, PricingPlan, Subscription } from '../entities';
import { BillingProviderId, SubStatus } from '../types/enums';
import { MockSession } from './mock-billing.types';

const PERIOD_MS = 30 * 24 * 60 * 60 * 1000;

@Injectable()
export class MockBillingProvider implements PaymentProvider {
  readonly id = BillingProviderId.MOCK;

  private readonly sessions = new Map<string, MockSession>();

  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Invoice)
    private readonly invoiceRepo: Repository<Invoice>,
    @InjectRepository(PricingPlan)
    private readonly pricingRepo: Repository<PricingPlan>,
    private readonly config: ConfigService,
  ) {}

  async createCheckoutSession(input: CheckoutInput): Promise<CheckoutResponse> {
    const pricing = await this.pricingRepo.findOne({
      where: { plan: input.targetPlan, cycle: input.cycle, active: true },
    });
    if (!pricing) {
      throw new BillingProviderError(
        'Pricing not configured for this plan and cycle',
      );
    }

    const sessionId = crypto.randomUUID();
    this.sessions.set(sessionId, {
      ownerId: input.ownerId,
      businessId: input.businessId,
      targetPlan: input.targetPlan,
      cycle: input.cycle,
      status: 'pending',
      createdAt: new Date(),
    });

    return {
      sessionId,
      mode: 'instant',
      amountCents: pricing.amountCents,
      currency: pricing.currency,
      plan: input.targetPlan,
      cycle: input.cycle,
    };
  }

  async confirmCheckoutSession(
    sessionId: string,
    businessId: number,
  ): Promise<NormalizedEvent[]> {
    const session = this.sessions.get(sessionId);
    if (!session) throw new BillingProviderError('Unknown checkout session');
    if (session.businessId !== businessId)
      throw new BillingProviderError(
        'Session does not belong to this business',
      );
    if (session.status !== 'pending')
      throw new BillingProviderError('Checkout session is not pending');

    const pricing = await this.pricingRepo.findOne({
      where: { plan: session.targetPlan, cycle: session.cycle, active: true },
    });
    if (!pricing) throw new BillingProviderError('Pricing not configured');

    session.status = 'completed';
    this.sessions.set(sessionId, session);

    const now = new Date();
    const periodEnd = new Date(now.getTime() + PERIOD_MS);

    return [
      {
        type: 'subscription.activated',
        businessId: session.businessId,
        provider: BillingProviderId.MOCK,
        providerSubId: crypto.randomUUID(),
        plan: session.targetPlan,
        cycle: session.cycle,
        status: SubStatus.ACTIVE,
        periodStart: now,
        periodEnd,
      },
      {
        type: 'invoice.paid',
        businessId: session.businessId,
        providerInvoiceId: crypto.randomUUID(),
        amountCents: pricing.amountCents,
        currency: pricing.currency,
        periodStart: now,
        periodEnd,
        paidAt: now,
        hostedUrl: null,
      },
    ];
  }

  async cancelSubscription(businessId: number): Promise<NormalizedEvent[]> {
    const sub = await this.subscriptionRepo.findOne({ where: { businessId } });
    if (!sub) throw new BillingProviderError('No subscription to cancel');

    return [
      {
        type: 'subscription.canceled',
        businessId,
        cancelAt: sub.currentPeriodEnd,
      },
    ];
  }

  async resumeSubscription(businessId: number): Promise<NormalizedEvent[]> {
    const sub = await this.subscriptionRepo.findOne({ where: { businessId } });
    if (!sub) throw new BillingProviderError('No subscription to resume');

    return [
      {
        type: 'subscription.updated',
        businessId,
        plan: sub.plan,
        cycle: sub.cycle,
        status: sub.status,
        periodEnd: sub.currentPeriodEnd,
        cancelAtPeriodEnd: false,
      },
    ];
  }

  async getSubscription(
    businessId: number,
  ): Promise<SubscriptionSnapshot | null> {
    const row = await this.subscriptionRepo.findOne({ where: { businessId } });
    if (!row) return null;
    return {
      plan: row.plan,
      cycle: row.cycle,
      status: row.status,
      currentPeriodStart: row.currentPeriodStart,
      currentPeriodEnd: row.currentPeriodEnd,
      cancelAtPeriodEnd: row.cancelAtPeriodEnd,
      providerSubId: row.providerSubId,
    };
  }

  async listInvoices(businessId: number, limit = 10): Promise<InvoiceDto[]> {
    const sub = await this.subscriptionRepo.findOne({ where: { businessId } });
    if (!sub) return [];

    const rows = await this.invoiceRepo.find({
      where: { subscriptionId: sub.id },
      order: { createdAt: 'DESC' } as const,
      take: limit,
    });

    return rows.map((r) => ({
      providerInvoiceId: r.providerInvoiceId,
      amountCents: r.amountCents,
      currency: r.currency,
      status: r.status,
      periodStart: r.periodStart,
      periodEnd: r.periodEnd,
      paidAt: r.paidAt,
      hostedUrl: r.hostedUrl,
    }));
  }

  ownsWebhook(headers: Record<string, string | string[] | undefined>): boolean {
    const sig = headers['x-mock-signature'];
    return typeof sig === 'string' && sig.trim().length > 0;
  }

  parseWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): NormalizedEvent[] {
    const secret = this.config.get<string>('MOCK_WEBHOOK_SECRET') ?? '';
    const sig = headers['x-mock-signature'];
    if (typeof sig !== 'string' || sig.length === 0)
      throw new WebhookSignatureError('Missing mock signature');

    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('hex');
    const a = Buffer.from(expected, 'utf8');
    const b = Buffer.from(sig, 'utf8');
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      throw new WebhookSignatureError('Invalid mock signature');
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody.toString('utf8')) as unknown;
    } catch {
      throw new BillingProviderError('Invalid webhook payload');
    }

    const events = Array.isArray(parsed) ? parsed : [parsed];
    for (const e of events) this.assertValidEventPayload(e);
    return events as NormalizedEvent[];
  }

  private assertValidEventPayload(
    event: unknown,
  ): asserts event is NormalizedEvent {
    if (!event || typeof event !== 'object') {
      throw new BillingProviderError('Invalid webhook payload');
    }
    const e = event as Record<string, unknown>;
    if (typeof e.type !== 'string') {
      throw new BillingProviderError('Invalid webhook payload: missing type');
    }

    const requireNumber = (field: string) => {
      if (typeof e[field] !== 'number')
        throw new BillingProviderError(
          `Invalid webhook payload: ${field} must be number`,
        );
    };
    const requireString = (field: string) => {
      if (typeof e[field] !== 'string')
        throw new BillingProviderError(
          `Invalid webhook payload: ${field} must be string`,
        );
    };

    switch (e.type) {
      case 'subscription.activated':
        requireNumber('businessId');
        requireString('provider');
        requireString('providerSubId');
        requireString('plan');
        requireString('cycle');
        requireString('status');
        return;
      case 'subscription.updated':
        requireNumber('businessId');
        requireString('plan');
        requireString('cycle');
        requireString('status');
        return;
      case 'subscription.canceled':
      case 'subscription.deleted':
        requireNumber('businessId');
        return;
      case 'invoice.paid':
        requireNumber('businessId');
        requireString('providerInvoiceId');
        requireNumber('amountCents');
        requireString('currency');
        return;
      case 'invoice.failed':
        requireNumber('businessId');
        requireString('providerInvoiceId');
        requireString('reason');
        return;
      default:
        throw new BillingProviderError(
          `Invalid webhook payload: unknown type ${e.type}`,
        );
    }
  }
}
