import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { StripeWebhookService } from './stripe-webhook.service';

type RawBodyRequest = Request & { rawBody?: Buffer };

@Controller('billing/webhook')
export class StripeWebhookController {
  constructor(private readonly webhookService: StripeWebhookService) {}

  @Post('stripe')
  @HttpCode(HttpStatus.OK)
  async handle(
    @Req() req: RawBodyRequest,
    @Headers() headers: Record<string, string | string[] | undefined>,
  ): Promise<void> {
    if (!req.rawBody || !Buffer.isBuffer(req.rawBody)) {
      throw new BadRequestException('Missing raw webhook body');
    }
    await this.webhookService.handle(req.rawBody, headers);
  }
}
