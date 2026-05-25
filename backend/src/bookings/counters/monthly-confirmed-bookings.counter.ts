import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UsageCounter } from '../../entitlements/counters/usage-counter.interface';
import { Clock } from '../../common/time/clock.service';
import { startOfMonth, startOfNextMonth } from '../../common/time/local-date';
import { Booking, BookingStatus } from '../entities/booking.entity';

@Injectable()
export class MonthlyConfirmedBookingsCounter implements UsageCounter {
  constructor(
    @InjectRepository(Booking)
    private readonly repo: Repository<Booking>,
    private readonly clock: Clock,
  ) {}

  count({
    businessId,
  }: {
    ownerId: number;
    businessId: number;
  }): Promise<number> {
    const now = this.clock.now();
    return this.repo
      .createQueryBuilder('booking')
      .innerJoin('booking.service', 'service')
      .where('service.businessId = :businessId', { businessId })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .andWhere('booking.confirmedAt BETWEEN :from AND :to', {
        from: startOfMonth(now),
        to: startOfNextMonth(now),
      })
      .getCount();
  }
}
