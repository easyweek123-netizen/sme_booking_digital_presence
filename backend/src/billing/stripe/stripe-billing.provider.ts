import { Injectable, NotImplementedException } from '@nestjs/common';
import type { PaymentProvider } from '../providers/payment-provider.interface';
import { BillingProviderId } from '../types/enums';
import type {
  CheckoutInput,
  CheckoutResponse,
  InvoiceDto,
  NormalizedEvent,
  SubscriptionSnapshot,
} from '../types/state-events';

const NOT_IMPL = 'Stripe provider not yet implemented';

@Injectable()
export class StripeBillingProvider implements PaymentProvider {
  readonly id = BillingProviderId.STRIPE;

  createCheckoutSession(input: CheckoutInput): Promise<CheckoutResponse> {
    void input;
    throw new NotImplementedException(NOT_IMPL);
  }

  confirmCheckoutSession(
    sessionId: string,
    businessId: number,
  ): Promise<NormalizedEvent[]> {
    void sessionId;
    void businessId;
    throw new NotImplementedException(NOT_IMPL);
  }

  cancelSubscription(businessId: number): Promise<NormalizedEvent[]> {
    void businessId;
    throw new NotImplementedException(NOT_IMPL);
  }

  resumeSubscription(businessId: number): Promise<NormalizedEvent[]> {
    void businessId;
    throw new NotImplementedException(NOT_IMPL);
  }

  getSubscription(businessId: number): Promise<SubscriptionSnapshot | null> {
    void businessId;
    throw new NotImplementedException(NOT_IMPL);
  }

  listInvoices(businessId: number, limit?: number): Promise<InvoiceDto[]> {
    void businessId;
    void limit;
    throw new NotImplementedException(NOT_IMPL);
  }

  ownsWebhook(headers: Record<string, string | string[] | undefined>): boolean {
    const sig = headers['stripe-signature'];
    if (Array.isArray(sig)) return sig.some((s) => s.trim().length > 0);
    return typeof sig === 'string' && sig.trim().length > 0;
  }

  parseWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): NormalizedEvent[] {
    void rawBody;
    void headers;
    throw new NotImplementedException(NOT_IMPL);
  }
}
