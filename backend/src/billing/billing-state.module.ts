import { Module } from '@nestjs/common';
import { BillingStateService } from './services/billing-state.service';

@Module({
  providers: [BillingStateService],
  exports: [BillingStateService],
})
export class BillingStateModule {}
