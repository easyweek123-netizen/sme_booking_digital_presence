import type { BillingProviderId } from '../types/enums';
import type {
  CheckoutInput,
  CheckoutResponse,
  InvoiceDto,
  NormalizedEvent,
  SubscriptionSnapshot,
} from '../types/state-events';

export interface PaymentProvider {
  readonly id: BillingProviderId;

  /** Start a checkout session. Returns a normalized response the frontend renders by `mode`. */
  createCheckoutSession(input: CheckoutInput): Promise<CheckoutResponse>;

  /**
   * Confirm a checkout session and produce activation events.
   * Providers using webhook-driven confirmation (e.g. Stripe) MUST return [] and set
   * `supportsInstantConfirm = false` on their id constant. Mock returns [activated, paid].
   */
  confirmCheckoutSession(
    sessionId: string,
    businessId: number,
  ): Promise<NormalizedEvent[]>;

  /** Cancel at period end. Returns events to apply now (mock) or [] (Stripe; webhook will follow). */
  cancelSubscription(businessId: number): Promise<NormalizedEvent[]>;

  /** Reverse a scheduled cancel. Same return contract as cancelSubscription. */
  resumeSubscription(businessId: number): Promise<NormalizedEvent[]>;

  /** Read-side: return the current subscription state. */
  getSubscription(businessId: number): Promise<SubscriptionSnapshot | null>;

  /** Read-side: list invoices for a business (newest first). */
  listInvoices(businessId: number, limit?: number): Promise<InvoiceDto[]>;

  /** Webhook ownership predicate: does this provider own the inbound webhook? */
  ownsWebhook(headers: Record<string, string | string[] | undefined>): boolean;

  /** Webhook parser: verify signature and return normalized events. Throws on signature mismatch. */
  parseWebhook(
    rawBody: Buffer,
    headers: Record<string, string | string[] | undefined>,
  ): NormalizedEvent[];
}
