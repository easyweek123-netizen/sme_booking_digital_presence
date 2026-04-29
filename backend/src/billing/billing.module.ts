import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { BusinessModule } from '../business/business.module';
import { BillingEvent, Invoice, PricingPlan, Subscription } from './entities';
import { BillingController } from './billing.controller';
import { BillingService } from './services/billing.service';
import { BillingStateModule } from './billing-state.module';
import { MockBillingModule } from './mock/mock-billing.module';
import { StripeBillingModule } from './stripe/stripe-billing.module';
import { MockBillingProvider } from './mock/mock-billing.provider';
import { StripeBillingProvider } from './stripe/stripe-billing.provider';
import { PAYMENT_PROVIDER } from './providers/payment-provider.token';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Subscription,
      Invoice,
      BillingEvent,
      PricingPlan,
    ]),
    ConfigModule,
    AuthModule,
    BusinessModule,
    BillingStateModule,
    MockBillingModule,
    StripeBillingModule,
  ],
  controllers: [BillingController],
  providers: [
    BillingService,
    {
      provide: PAYMENT_PROVIDER,
      inject: [MockBillingProvider, StripeBillingProvider, ConfigService],
      useFactory: (
        mock: MockBillingProvider,
        stripe: StripeBillingProvider,
        config: ConfigService,
      ) => {
        const mode = config.getOrThrow<string>('BILLING_MODE');
        if (mode === 'mock') return mock;
        if (mode === 'stripe') return stripe;
        throw new Error(`Unsupported BILLING_MODE: ${mode}`);
      },
    },
  ],
  exports: [BillingService, PAYMENT_PROVIDER],
})
export class BillingModule {}
