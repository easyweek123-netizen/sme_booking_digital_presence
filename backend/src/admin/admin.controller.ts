import {
  Controller,
  Delete,
  Get,
  Param,
  Headers,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OwnerService } from '../owner/owner.service';
import { BusinessService } from '../business/business.service';

@Controller('admin')
export class AdminController {
  private readonly adminSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly ownerService: OwnerService,
    private readonly businessService: BusinessService,
  ) {
    this.adminSecret = this.configService.get<string>('ADMIN_SECRET') || 'dev-secret-123';
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
   * Delete owner by email (also deletes their business)
   * Usage: curl -X DELETE -H "x-admin-secret: YOUR_SECRET" http://localhost:3001/api/admin/owners/email@example.com
   */
  @Delete('owners/:email')
  async deleteOwnerByEmail(
    @Param('email') email: string,
    @Headers('x-admin-secret') secret: string,
  ) {
    this.checkSecret(secret);

    const owner = await this.ownerService.findByEmail(email);
    if (!owner) {
      throw new NotFoundException(`Owner with email ${email} not found`);
    }

    // Delete business first (if exists)
    const business = await this.businessService.findByOwnerId(owner.id);
    if (business) {
      await this.businessService.remove(business.id);
    }

    // Delete owner
    await this.ownerService.remove(owner.id);

    return {
      success: true,
      message: `Deleted owner ${email} and their business`,
      deletedOwnerId: owner.id,
      deletedBusinessId: business?.id || null,
    };
  }
}

