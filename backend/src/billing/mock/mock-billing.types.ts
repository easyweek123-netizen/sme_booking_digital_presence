import { BillingCycle, Plan } from '../types/enums';

export type MockSessionStatus = 'pending' | 'completed' | 'canceled';

export interface MockSession {
  ownerId: number;
  businessId: number;
  targetPlan: Exclude<Plan, Plan.FREE>;
  cycle: BillingCycle;
  status: MockSessionStatus;
  createdAt: Date;
}
