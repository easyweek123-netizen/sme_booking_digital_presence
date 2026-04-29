import {
  BillingCycle,
  BillingProviderId,
  InvoiceStatus,
  Plan,
  SubStatus,
} from './enums';

export type CheckoutMode = 'embedded' | 'redirect' | 'instant';

export interface CheckoutResponse {
  sessionId: string;
  mode: CheckoutMode;
  /** Present when mode === 'embedded' (e.g. Stripe Elements) */
  clientSecret?: string;
  /** Present when mode === 'embedded' */
  publishableKey?: string;
  /** Present when mode === 'redirect' (e.g. PayPal, hosted Stripe Checkout) */
  redirectUrl?: string;
  amountCents: number;
  currency: string;
  plan: Plan;
  cycle: BillingCycle;
}

export interface CheckoutInput {
  ownerId: number;
  businessId: number;
  targetPlan: Exclude<Plan, Plan.FREE>;
  cycle: BillingCycle;
  returnUrl: string;
}

export interface SubscriptionSnapshot {
  plan: Plan;
  cycle: BillingCycle;
  status: SubStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  providerSubId: string;
}

export interface InvoiceDto {
  providerInvoiceId: string;
  amountCents: number;
  currency: string;
  status: InvoiceStatus;
  periodStart: Date;
  periodEnd: Date;
  paidAt: Date | null;
  hostedUrl: string | null;
}

export type NormalizedEvent =
  | {
      type: 'subscription.activated';
      businessId: number;
      provider: BillingProviderId;
      providerSubId: string;
      plan: Plan;
      cycle: BillingCycle;
      status: SubStatus;
      periodStart: Date;
      periodEnd: Date;
    }
  | {
      type: 'subscription.updated';
      businessId: number;
      plan: Plan;
      cycle: BillingCycle;
      status: SubStatus;
      periodEnd: Date;
      cancelAtPeriodEnd: boolean;
    }
  | { type: 'subscription.canceled'; businessId: number; cancelAt: Date }
  | { type: 'subscription.deleted'; businessId: number }
  | {
      type: 'invoice.paid';
      businessId: number;
      providerInvoiceId: string;
      amountCents: number;
      currency: string;
      periodStart: Date;
      periodEnd: Date;
      paidAt: Date;
      hostedUrl: string | null;
    }
  | {
      type: 'invoice.failed';
      businessId: number;
      providerInvoiceId: string;
      reason: string;
    };
