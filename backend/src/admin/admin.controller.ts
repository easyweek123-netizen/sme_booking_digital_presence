import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  Headers,
  UnauthorizedException,
  ParseIntPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OwnerService } from '../owner/owner.service';
import { BookingsService } from '../bookings/bookings.service';
import { AdminBillingCleanupService } from './admin-billing-cleanup.service';
import { AdminOwnerCleanupService } from './admin-owner-cleanup.service';

@Controller('admin')
export class AdminController {
  private readonly adminSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly ownerService: OwnerService,
    private readonly bookingsService: BookingsService,
    private readonly adminBillingCleanup: AdminBillingCleanupService,
    private readonly adminOwnerCleanup: AdminOwnerCleanupService,
  ) {
    this.adminSecret = this.configService.get<string>('ADMIN_SECRET') || '';
    if (!this.adminSecret) {
      throw new Error(
        'ADMIN_SECRET environment variable is required. Set it in your .env file.',
      );
    }
  }

  private checkSecret(secret: string | undefined): void {
    if (secret !== this.adminSecret) {
      throw new UnauthorizedException('Invalid admin secret');
    }
  }

  /**
   * List all owners
   * Usage: curl -H "x-admin-secret: YOUR_SECRET" http://localhost:3001/api/admin/owners
   */
  @Get('owners')
  async listOwners(@Headers('x-admin-secret') secret: string) {
    this.checkSecret(secret);
    const owners = await this.ownerService.findAll();
    return owners.map((o) => ({
      id: o.id,
      email: o.email,
      name: o.name,
      createdAt: o.createdAt,
    }));
  }

  /**
   * Delete owner by email plus all bookings, business, services, schedules,
   * billing, notes, and conversations. Transactional.
   * Usage: curl -X DELETE -H "x-admin-secret: SECRET" http://localhost:3000/api/admin/owners/email@example.com
   */
  @Delete('owners/:email')
  async deleteOwnerByEmail(
    @Param('email') email: string,
    @Headers('x-admin-secret') secret: string,
  ) {
    this.checkSecret(secret);
    return this.adminOwnerCleanup.cleanupByOwnerEmail(email);
  }

  /**
   * Hard-delete a booking by id. Optional ?reference= must match row (safety).
   * Usage: curl -X DELETE -H "x-admin-secret: SECRET" "http://localhost:3000/api/admin/bookings/27?reference=BK-NQCG"
   */
  @Delete('bookings/:id')
  async deleteBooking(
    @Param('id', ParseIntPipe) id: number,
    @Query('reference') reference: string | undefined,
    @Headers('x-admin-secret') secret: string,
  ) {
    this.checkSecret(secret);
    return this.bookingsService.remove(id, reference);
  }

  /**
   * Delete subscription and invoices for the owner’s business; reset business.plan to free.
   * Usage: curl -X DELETE -H "x-admin-secret: SECRET" "http://localhost:3000/api/admin/billing/by-owner-email/user@example.com"
   */
  @Delete('billing/by-owner-email/:email')
  async deleteBillingByOwnerEmail(
    @Param('email') email: string,
    @Headers('x-admin-secret') secret: string,
  ) {
    this.checkSecret(secret);
    return this.adminBillingCleanup.cleanupByOwnerEmail(email);
  }

  /**
   * Same cleanup by business id.
   * Usage: curl -X DELETE -H "x-admin-secret: SECRET" "http://localhost:3000/api/admin/billing/by-business-id/42"
   */
  @Delete('billing/by-business-id/:businessId')
  async deleteBillingByBusinessId(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Headers('x-admin-secret') secret: string,
  ) {
    this.checkSecret(secret);
    return this.adminBillingCleanup.cleanupForBusinessId(businessId);
  }
}
