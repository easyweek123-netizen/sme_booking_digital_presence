import type { Plan } from '../types/billing.types';

export const PLAN_ORDER: readonly Plan[] = ['free', 'pro', 'growth'] as const;

export function isLowerTier(current: Plan, target: Plan): boolean {
  return PLAN_ORDER.indexOf(current) < PLAN_ORDER.indexOf(target);
}

export function isHigherTier(current: Plan, target: Plan): boolean {
  return PLAN_ORDER.indexOf(current) > PLAN_ORDER.indexOf(target);
}
