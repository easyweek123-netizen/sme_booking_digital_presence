import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Calendar, CalendarStatus } from '../entities/calendar.entity';

@Injectable()
export class CalendarRepository {
  constructor(
    @InjectRepository(Calendar) private readonly repo: Repository<Calendar>,
  ) {}

  findByBusinessAndProvider(
    businessId: number,
    provider: 'google' = 'google',
  ): Promise<Calendar | null> {
    return this.repo.findOne({ where: { businessId, provider } });
  }

  findById(id: number): Promise<Calendar | null> {
    return this.repo.findOneBy({ id });
  }

  async upsertConnected(input: {
    businessId: number;
    provider: 'google';
    providerAccountEmail: string;
    refreshToken: string;
    scope: string;
  }): Promise<void> {
    const existing = await this.findByBusinessAndProvider(
      input.businessId,
      input.provider,
    );
    if (existing) {
      await this.repo.save({
        ...existing,
        providerAccountEmail: input.providerAccountEmail,
        refreshToken: input.refreshToken,
        scope: input.scope,
        status: 'connected' as CalendarStatus,
        lastError: null,
        disconnectedAt: null,
      });
      return;
    }
    await this.repo.save({
      businessId: input.businessId,
      provider: input.provider,
      providerAccountEmail: input.providerAccountEmail,
      refreshToken: input.refreshToken,
      scope: input.scope,
      status: 'connected' as CalendarStatus,
    });
  }

  async setDisconnected(id: number): Promise<void> {
    await this.repo.update(id, {
      status: 'disconnected',
      refreshToken: null,
      disconnectedAt: new Date(),
    });
  }

  async setLastSyncedAt(id: number, when: Date): Promise<void> {
    await this.repo.update(id, { lastSyncAt: when });
  }

  async clearLastError(id: number): Promise<void> {
    await this.repo.update(id, { lastError: null });
  }

  async setError(id: number, message: string, fatal: boolean): Promise<void> {
    await this.repo.update(id, {
      ...(fatal ? { status: 'error' as CalendarStatus } : {}),
      lastError: message.slice(0, 500),
    });
  }
}
