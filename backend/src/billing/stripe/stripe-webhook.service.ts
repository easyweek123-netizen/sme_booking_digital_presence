import { BadRequestException, Injectable } from '@nestjs/common';
import { StripeBillingProvider } from './stripe-billing.provider';
import { BillingStateService } from '../services/billing-state.service';

type HeaderMap = Record<string, string | string[] | undefined>;

@Injectable()
export class StripeWebhookService {
  constructor(
    private readonly stripe: StripeBillingProvider,
    private readonly state: BillingStateService,
  ) {}

  async handle(rawBody: Buffer, headers: HeaderMap): Promise<void> {
    if (!this.stripe.ownsWebhook(headers)) {
      throw new BadRequestException(
        'Webhook signature does not match provider',
      );
    }
    const events = this.stripe.parseWebhook(rawBody, headers);
    for (const e of events) {
      await this.state.applyEvent(e);
    }
  }
}
