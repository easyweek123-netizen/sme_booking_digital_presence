import { Module } from '@nestjs/common';
import { BillingStateModule } from '../billing-state.module';
import { StripeBillingProvider } from './stripe-billing.provider';
import { StripeWebhookService } from './stripe-webhook.service';
import { StripeWebhookController } from './stripe-webhook.controller';

@Module({
  imports: [BillingStateModule],
  controllers: [StripeWebhookController],
  providers: [StripeBillingProvider, StripeWebhookService],
  exports: [StripeBillingProvider],
})
export class StripeBillingModule {}
