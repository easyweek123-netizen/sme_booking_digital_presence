import { Global, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { BillingModule } from '../billing/billing.module';
import { OwnerResolverGuard } from '../common/guards/owner-resolver.guard';
import { EntitlementGuard } from './gate/entitlement.guard';
import { UsageCounterRegistry } from './counters/usage-counter.registry';

@Global()
@Module({
  imports: [BillingModule, AuthModule],
  providers: [EntitlementGuard, OwnerResolverGuard, UsageCounterRegistry],
  exports: [EntitlementGuard, OwnerResolverGuard, UsageCounterRegistry],
})
export class EntitlementsModule {}
