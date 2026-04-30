import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { OwnerId, OwnerResolverGuard } from '../common';
import { BillingService } from './services/billing.service';
import { CheckoutIntentDto, ConfirmIntentDto } from './dto';
import {
  CheckoutResponse,
  InvoiceDto,
  SubscriptionSnapshot,
} from './types/state-events';

@Controller('billing')
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  // Public: pricing list
  @Get('pricing')
  listPricing() {
    return this.billing.listPricing();
  }

  // Authenticated: checkout
  @Post('checkout')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  startCheckout(
    @OwnerId() ownerId: number,
    @Body() dto: CheckoutIntentDto,
  ): Promise<CheckoutResponse> {
    return this.billing.startCheckout(ownerId, dto);
  }

  // Authenticated: confirm checkout (mock-mode only — Stripe uses webhook)
  @Post('checkout/confirm')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async confirmCheckout(
    @OwnerId() ownerId: number,
    @Body() dto: ConfirmIntentDto,
  ): Promise<void> {
    await this.billing.confirmCheckout(ownerId, dto.sessionId);
  }

  // Authenticated: read subscription
  @Get('subscription')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  getSubscription(
    @OwnerId() ownerId: number,
  ): Promise<SubscriptionSnapshot | null> {
    return this.billing.getSubscription(ownerId);
  }

  // Authenticated: list invoices
  @Get('invoices')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  listInvoices(
    @OwnerId() ownerId: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<InvoiceDto[]> {
    return this.billing.listInvoices(ownerId, limit);
  }

  // Authenticated: cancel
  @Post('cancel')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async cancel(@OwnerId() ownerId: number): Promise<void> {
    await this.billing.cancel(ownerId);
  }

  // Authenticated: resume
  @Post('resume')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async resume(@OwnerId() ownerId: number): Promise<void> {
    await this.billing.resume(ownerId);
  }
}
