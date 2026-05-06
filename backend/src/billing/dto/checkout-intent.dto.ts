import { IsIn, IsUrl } from 'class-validator';
import { BillingCycle, Plan } from '../types/enums';

export class CheckoutIntentDto {
  @IsIn([Plan.PRO, Plan.GROWTH])
  plan: Plan;

  @IsIn([BillingCycle.MONTHLY, BillingCycle.ANNUAL])
  cycle: BillingCycle;

  @IsUrl({ require_tld: false })
  returnUrl: string;
}
