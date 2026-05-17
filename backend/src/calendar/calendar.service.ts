import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../business/entities/business.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CalendarRepository } from './repositories/calendar.repository';
import { CalendarEventRepository } from './repositories/calendar-event.repository';
import { CalendarSyncLogRepository } from './repositories/calendar-sync-log.repository';
import { GoogleOAuthService } from './google/google-oauth.service';
import {
  GoogleCalendarApiService,
  GoogleCalendarApiError,
} from './google/google-calendar-api.service';
import { GoogleEventFactory } from './google/google-event.factory';
import { TokenEncryptionService } from './google/token-encryption.service';
import { CalendarStatusDto } from './dto/calendar-status.dto';
import { CalendarSyncLogDto } from './dto/calendar-sync-log.dto';

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);
  private readonly frontendUrl: string;

  constructor(
    private readonly calendars: CalendarRepository,
    private readonly events: CalendarEventRepository,
    private readonly logs: CalendarSyncLogRepository,
    private readonly oauth: GoogleOAuthService,
    private readonly api: GoogleCalendarApiService,
    private readonly factory: GoogleEventFactory,
    private readonly encryption: TokenEncryptionService,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    config: ConfigService,
  ) {
    this.frontendUrl = config.get<string>('calendar.frontendUrl') || '';
  }

  // ── Status / listing ─────────────────────────────────────────────────────

  async getStatus(ownerId: number): Promise<CalendarStatusDto> {
    const calendar = await this.findForOwner(ownerId);
    if (!calendar)
      return { connected: false, email: null, lastSyncAt: null, status: null };
    return {
      connected: calendar.status === 'connected',
      email: calendar.providerAccountEmail,
      lastSyncAt: calendar.lastSyncAt
        ? calendar.lastSyncAt.toISOString()
        : null,
      status: calendar.status,
    };
  }

  async listSyncLog(
    ownerId: number,
    limit: number,
  ): Promise<CalendarSyncLogDto[]> {
    const calendar = await this.findForOwner(ownerId);
    if (!calendar) return [];
    const rows = await this.logs.listRecent(calendar.id, limit);
    return rows.map((r) => ({
      id: r.id,
      operation: r.operation,
      status: r.status,
      errorCode: r.errorCode,
      errorMessage: r.errorMessage,
      externalEventId: r.externalEventId,
      createdAt: r.createdAt.toISOString(),
    }));
  }

  // ── OAuth flow ───────────────────────────────────────────────────────────

  buildGoogleAuthUrl(ownerId: number): string {
    return this.oauth.buildAuthUrl(ownerId);
  }

  async handleGoogleCallback(code: string, state: string): Promise<void> {
    const { ownerId } = this.oauth.verifyState(state);
    const tokens = await this.oauth.exchangeCode(code);
    const businessId = await this.resolveBusinessId(ownerId);
    const encrypted = await this.encryption.encrypt(tokens.refreshToken);
    await this.calendars.upsertConnected({
      businessId,
      provider: 'google',
      providerAccountEmail: tokens.email,
      refreshToken: encrypted,
      scope: tokens.scope,
    });
  }

  async disconnectGoogle(ownerId: number): Promise<void> {
    const calendar = await this.findForOwner(ownerId);
    if (!calendar || calendar.status !== 'connected') return;
    const refreshToken = calendar.refreshToken
      ? await this.encryption.decrypt(calendar.refreshToken)
      : null;
    await this.calendars.setDisconnected(calendar.id);
    if (refreshToken) await this.oauth.revokeRefreshToken(refreshToken);
  }

  /** Builds the FE redirect URL after a Google callback (success or error). */
  redirectAfterCallback(status: 'success' | 'error', reason?: string): string {
    const base = `${this.frontendUrl}/dashboard/settings/calendar?status=${status}`;
    return reason ? `${base}&reason=${encodeURIComponent(reason)}` : base;
  }

  // ── Sync (called from BookingSyncListener) ───────────────────────────────

  async syncBookingConfirmed(bookingId: number): Promise<void> {
    const ctx = await this.loadSyncContext(bookingId);
    if (!ctx) return;

    const existing = await this.events.findByBookingAndCalendar(
      bookingId,
      ctx.calendar.id,
    );
    if (existing) {
      this.logger.log(
        `Booking ${bookingId} already mapped to ${existing.externalEventId}`,
      );
      return;
    }

    const input = this.factory.create(ctx.booking);
    try {
      const externalEventId = await this.api.createEvent(
        ctx.refreshToken,
        input,
      );
      await this.events.record({
        bookingId,
        calendarId: ctx.calendar.id,
        externalEventId,
      });
      await this.logs.record({
        calendarId: ctx.calendar.id,
        bookingId,
        operation: 'create_event',
        status: 'success',
        externalEventId,
      });
      const now = new Date();
      await this.calendars.setLastSyncedAt(ctx.calendar.id, now);
      await this.calendars.clearLastError(ctx.calendar.id);
      this.logger.log(`Synced booking ${bookingId} → ${externalEventId}`);
    } catch (e) {
      await this.handleSyncFailure(
        ctx.calendar.id,
        bookingId,
        'create_event',
        e,
      );
    }
  }

  async syncBookingCancelled(bookingId: number): Promise<void> {
    const event = await this.events.findByBooking(bookingId);
    if (!event) return;

    const calendar = await this.calendars.findById(event.calendarId);
    if (
      !calendar ||
      calendar.status !== 'connected' ||
      !calendar.refreshToken
    ) {
      await this.events.deleteById(event.id);
      return;
    }

    const refreshToken = await this.encryption.decrypt(calendar.refreshToken);

    try {
      await this.api.deleteEvent(refreshToken, event.externalEventId);
      await this.events.deleteById(event.id);
      await this.logs.record({
        calendarId: calendar.id,
        bookingId,
        operation: 'delete_event',
        status: 'success',
        externalEventId: event.externalEventId,
      });
      const now = new Date();
      await this.calendars.setLastSyncedAt(calendar.id, now);
      await this.calendars.clearLastError(calendar.id);
      this.logger.log(
        `Removed event ${event.externalEventId} for booking ${bookingId}`,
      );
    } catch (e) {
      await this.handleSyncFailure(
        calendar.id,
        bookingId,
        'delete_event',
        e,
        event.externalEventId,
      );
    }
  }

  // ── Internal helpers ─────────────────────────────────────────────────────

  private async findForOwner(ownerId: number) {
    const businessId = await this.resolveBusinessId(ownerId);
    return this.calendars.findByBusinessAndProvider(businessId);
  }

  private async resolveBusinessId(ownerId: number): Promise<number> {
    const business = await this.businessRepository.findOne({
      where: { ownerId },
    });
    if (!business) throw new NotFoundException('Business not found');
    return business.id;
  }

  private async loadSyncContext(bookingId: number) {
    const booking = await this.bookingRepository.findOne({
      where: { id: bookingId },
      relations: ['service', 'service.business', 'customer'],
    });
    if (!booking) return null;
    const calendar = await this.calendars.findByBusinessAndProvider(
      booking.service.businessId,
    );
    if (!calendar || calendar.status !== 'connected' || !calendar.refreshToken)
      return null;
    const refreshToken = await this.encryption.decrypt(calendar.refreshToken);
    return { booking, calendar, refreshToken };
  }

  private async handleSyncFailure(
    calendarId: number,
    bookingId: number,
    operation: 'create_event' | 'delete_event',
    err: unknown,
    externalEventId?: string,
  ): Promise<void> {
    const apiError =
      err instanceof GoogleCalendarApiError
        ? err
        : new GoogleCalendarApiError(
            err instanceof Error ? err.message : String(err),
            'unknown',
            err,
          );
    const fatal = apiError.code === 'invalid_grant';

    await this.logs.record({
      calendarId,
      bookingId,
      operation,
      status: 'error',
      errorCode: apiError.code,
      errorMessage: apiError.message,
      externalEventId: externalEventId ?? null,
    });
    await this.calendars.setError(calendarId, apiError.message, fatal);
    this.logger.error(`[${operation}/${bookingId}] ${apiError.message}`);
  }
}
