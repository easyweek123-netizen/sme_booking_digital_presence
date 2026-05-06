import type { BillingCycle, Plan } from '../types/billing.types';

export const PLAN_LABEL: Record<Plan, string> = {
  free: 'Free',
  pro: 'Pro',
  growth: 'Growth',
};

export function planLabel(plan: Plan): string {
  return PLAN_LABEL[plan];
}

export function cycleLabel(cycle: BillingCycle): string {
  return cycle === 'monthly' ? 'Monthly' : 'Annual';
}

export function formatBillingDate(dateStr: string | null): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
