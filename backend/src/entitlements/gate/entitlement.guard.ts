import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PlanResolverService } from '../../billing/services/plan-resolver.service';
import { ENTITLEMENTS } from '../config/entitlements.config';
import type { EntitlementMeta } from './entitlement.decorator';
import { ENTITLEMENT_KEY } from './entitlement.decorator';
import { rank } from '../config/plan-rank';
import { UsageCounterRegistry } from '../counters/usage-counter.registry';
import { UpgradeRequiredException } from './upgrade-required.exception';
import type { RequestWithOwner } from '../../common/types';

@Injectable()
export class EntitlementGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly planResolver: PlanResolverService,
    private readonly counters: UsageCounterRegistry,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const meta = this.reflector.get<EntitlementMeta | undefined>(
      ENTITLEMENT_KEY,
      context.getHandler(),
    );
    if (!meta) return true;

    const req = context.switchToHttp().getRequest<RequestWithOwner>();

    if (meta.when && !meta.when(req)) return true;

    const ownerId = req.ownerId;
    if (typeof ownerId !== 'number') {
      throw new UnauthorizedException('Owner context required');
    }

    const spec = ENTITLEMENTS[meta.key];
    const { plan, businessId } = await this.planResolver.resolve(ownerId);

    if (spec.kind === 'feature') {
      if (rank(plan) >= rank(spec.minPlan)) return true;
      throw new UpgradeRequiredException({
        feature: meta.key,
        currentPlan: plan,
        requiredPlan: spec.minPlan,
      });
    }

    // quota gate
    if (rank(plan) >= rank(spec.unlimitedFrom)) return true;

    const used = await this.counters
      .get(spec.counter)
      .count({ ownerId, businessId });

    if (used < spec.freeCap) return true;

    throw new UpgradeRequiredException({
      feature: meta.key,
      currentPlan: plan,
      requiredPlan: spec.unlimitedFrom,
    });
  }
}
