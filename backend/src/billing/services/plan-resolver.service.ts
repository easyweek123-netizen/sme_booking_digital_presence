import { Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Plan, SubStatus } from '../types/enums';

@Injectable()
export class PlanResolverService {

  constructor(
    @InjectRepository(Business)
    private readonly businesses: Repository<Business>,
  ) {}

  async resolve(ownerId: number): Promise<{ plan: Plan; businessId: number }> {

    const business = await this.businesses.findOne({
      where: { ownerId },
      relations: ['subscription'],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    const sub = business.subscription;
    const plan =
      sub &&
      (sub.status === SubStatus.ACTIVE || sub.status === SubStatus.TRIALING)
        ? sub.plan
        : Plan.FREE;

    return { plan, businessId: business.id };
  }
}
