import type { Plan } from '../../../../types/billing.types';

export type PaidPlan = Exclude<Plan, 'free'>;

export function buildCheckoutRoute(): string {
  return '/dashboard/settings/checkout';
}

export function absoluteBillingReturnUrl(): string {
  return `${window.location.origin}/dashboard/settings/billing?welcome=1`;
}
