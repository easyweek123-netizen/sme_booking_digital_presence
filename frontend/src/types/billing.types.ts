export type Plan = 'free' | 'pro' | 'growth';
export type BillingCycle = 'monthly' | 'annual';
export type SubStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';
export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
export type CheckoutMode = 'embedded' | 'redirect' | 'instant';

export interface CheckoutResponse {
  sessionId: string;
  mode: CheckoutMode;
  clientSecret?: string;
  publishableKey?: string;
  redirectUrl?: string;
  amountCents: number;
  currency: string;
  plan: Plan;
  cycle: BillingCycle;
}

export interface SubscriptionSnapshot {
  plan: Plan;
  cycle: BillingCycle;
  status: SubStatus;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  providerSubId: string;
}

export interface InvoiceDto {
  providerInvoiceId: string;
  amountCents: number;
  currency: string;
  status: InvoiceStatus;
  periodStart: string;
  periodEnd: string;
  paidAt: string | null;
  hostedUrl: string | null;
}

export interface PricingItem {
  plan: Plan;
  cycle: BillingCycle;
  amountCents: number;
  currency: string;
  features: string[];
}

export type PricingResponse = PricingItem[];
