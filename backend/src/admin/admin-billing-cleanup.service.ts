import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Business } from '../business/entities/business.entity';
import { Invoice } from '../billing/entities/invoice.entity';
import { Subscription } from '../billing/entities/subscription.entity';
import { Plan } from '../billing/types/enums';
import { BusinessService } from '../business/business.service';
import { OwnerService } from '../owner/owner.service';

export type BillingCleanupResult = {
  success: true;
  deletedInvoices: number;
  deletedSubscriptions: number;
  businessId: number;
  resetPlanToFree: true;
};

@Injectable()
export class AdminBillingCleanupService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly ownerService: OwnerService,
    private readonly businessService: BusinessService,
  ) {}

  async cleanupByOwnerEmail(email: string): Promise<BillingCleanupResult> {
    const owner = await this.ownerService.findByEmail(email);
    if (!owner) {
      throw new NotFoundException(`Owner with email ${email} not found`);
    }
    const business = await this.businessService.findByOwnerId(owner.id);
    if (!business) {
      throw new NotFoundException(`No business for owner ${email}`);
    }
    return this.cleanupForBusinessId(business.id);
  }

  async cleanupForBusinessId(businessId: number): Promise<BillingCleanupResult> {
    const business = await this.businessService.findOne(businessId);
    if (!business) {
      throw new NotFoundException(`Business ${businessId} not found`);
    }

    return this.dataSource.transaction(async (manager) => {
      const sub = await manager.findOne(Subscription, {
        where: { businessId },
      });

      let deletedInvoices = 0;
      let deletedSubscriptions = 0;

      if (sub) {
        const inv = await manager.delete(Invoice, { subscriptionId: sub.id });
        deletedInvoices = inv.affected ?? 0;
        const subDel = await manager.delete(Subscription, { id: sub.id });
        deletedSubscriptions = subDel.affected ?? 0;
      }

      await manager.update(Business, businessId, {
        plan: Plan.FREE,
      });

      return {
        success: true,
        deletedInvoices,
        deletedSubscriptions,
        businessId,
        resetPlanToFree: true,
      };
    });
  }
}
