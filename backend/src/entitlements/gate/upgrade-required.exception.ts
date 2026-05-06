import { HttpException, HttpStatus } from '@nestjs/common';
import type { Plan } from '../../billing/types/enums';
import type { EntitlementKey } from '../config/entitlements.config';

export class UpgradeRequiredException extends HttpException {
  constructor(opts: {
    feature: EntitlementKey;
    requiredPlan: Plan;
    currentPlan: Plan;
    message?: string;
  }) {
    super(
      {
        code: 'UPGRADE_REQUIRED',
        message: opts.message ?? 'Upgrade required',
        feature: opts.feature,
        requiredPlan: opts.requiredPlan,
        currentPlan: opts.currentPlan,
      },
      HttpStatus.PAYMENT_REQUIRED,
    );
  }
}
