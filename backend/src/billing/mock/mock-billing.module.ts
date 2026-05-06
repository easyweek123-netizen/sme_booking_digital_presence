import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Invoice, PricingPlan, Subscription } from '../entities';
import { MockBillingProvider } from './mock-billing.provider';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, Invoice, PricingPlan])],
  providers: [MockBillingProvider],
  exports: [MockBillingProvider],
})
export class MockBillingModule {}
