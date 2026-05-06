import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UsageCounter } from '../../entitlements/counters/usage-counter.interface';
import { Service } from '../entities/service.entity';

@Injectable()
export class ActiveServicesCounter implements UsageCounter {
  constructor(
    @InjectRepository(Service)
    private readonly repo: Repository<Service>,
  ) {}

  count({ businessId }: { ownerId: number; businessId: number }): Promise<number> {
    return this.repo.count({ where: { businessId, isActive: true } });
  }
}
