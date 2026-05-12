import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CalendarSyncLog,
  SyncOperation,
  SyncLogStatus,
} from '../entities/calendar-sync-log.entity';

interface RecordInput {
  calendarId: number;
  bookingId: number | null;
  operation: SyncOperation;
  status: SyncLogStatus;
  errorCode?: string | null;
  errorMessage?: string | null;
  externalEventId?: string | null;
}

@Injectable()
export class CalendarSyncLogRepository {
  constructor(
    @InjectRepository(CalendarSyncLog)
    private readonly repo: Repository<CalendarSyncLog>,
  ) {}

  async record(input: RecordInput): Promise<void> {
    await this.repo.save({
      calendarId: input.calendarId,
      bookingId: input.bookingId,
      operation: input.operation,
      status: input.status,
      errorCode: input.errorCode ?? null,
      errorMessage: input.errorMessage?.slice(0, 500) ?? null,
      externalEventId: input.externalEventId ?? null,
    });
  }

  listRecent(calendarId: number, limit: number): Promise<CalendarSyncLog[]> {
    return this.repo.find({
      where: { calendarId },
      order: { createdAt: 'DESC' },
      take: Math.min(limit, 50),
    });
  }
}
