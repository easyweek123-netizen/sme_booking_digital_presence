import { BadRequestException } from '@nestjs/common';

export class BillingProviderError extends BadRequestException {
  constructor(message: string) {
    super(message);
  }
}

export class WebhookSignatureError extends BadRequestException {
  constructor(message = 'Invalid webhook signature') {
    super(message);
  }
}

export class UnknownProviderError extends BadRequestException {
  constructor(providerId: string) {
    super(`Unknown billing provider: ${providerId}`);
  }
}
