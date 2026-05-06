import { Plan } from '../../billing/types/enums';
import { CounterKey } from './counter-keys';

/** A capability locked behind a paid plan. Boolean check, no usage tracked. */
export type FeatureEntitlement = {
  kind: 'feature';
  /** Lowest plan that unlocks this capability. */
  minPlan: Plan;
};

/** A capability with a usage limit on the FREE plan; unlimited on paid plans. */
export type QuotaEntitlement = {
  kind: 'quota';
  /** Lowest plan on which the cap is removed (= unlimited). */
  unlimitedFrom: Plan;
  /** Hard cap applied to the FREE plan only. */
  freeCap: number;
  /** Counter strategy registered under this token. */
  counter: CounterKey;
};

export type EntitlementSpec = FeatureEntitlement | QuotaEntitlement;

export const ENTITLEMENTS = {
  'service.create':  { kind: 'quota',   unlimitedFrom: Plan.PRO, freeCap: 3,  counter: CounterKey.ActiveServices },
  'bookings.confirm': { kind: 'quota',   unlimitedFrom: Plan.PRO, freeCap: 30, counter: CounterKey.MonthlyConfirmedBookings },
  'chat.history':     { kind: 'quota',   unlimitedFrom: Plan.PRO, freeCap: 1,  counter: CounterKey.ChatThreads },
  'analytics.view':   { kind: 'feature', minPlan: Plan.PRO },
  'reminders.send':   { kind: 'feature', minPlan: Plan.PRO },
  'ics.export':       { kind: 'feature', minPlan: Plan.PRO },
  'domain.customize': { kind: 'feature', minPlan: Plan.PRO },
} as const satisfies Record<string, EntitlementSpec>;

export type EntitlementKey = keyof typeof ENTITLEMENTS;
