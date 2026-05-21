import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Booking } from '../bookings/entities/booking.entity';
import { BusinessService } from '../business/business.service';
import { Calendar } from './entities/calendar.entity';
import { CalendarRepository } from './repositories/calendar.repository';
import { CalendarEventRepository } from './repositories/calendar-event.repository';
import { CalendarSyncLogRepository } from './repositories/calendar-sync-log.repository';
import { GoogleOAuthService } from './google/google-oauth.service';
import {
  GoogleCalendarApiService,
  GoogleCalendarApiError,
} from './google/google-calendar-api.service';
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
    private readonly encryption: TokenEncryptionService,
    private readonly businesses: BusinessService,
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
    const business = await this.businesses.findByOwner(ownerId);
    const encrypted = await this.encryption.encrypt(tokens.refreshToken);
    await this.calendars.upsertConnected({
      businessId: business.id,
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

  redirectAfterCallback(status: 'success' | 'error', reason?: string): string {
    const base = `${this.frontendUrl}/dashboard/settings/calendar?status=${status}`;
    return reason ? `${base}&reason=${encodeURIComponent(reason)}` : base;
  }

  // ── Booking effects ──────────────────────────────────────────────────────
  async confirmBooking(booking: Booking): Promise<{ joinLink: string | null }> {
    const ctx = await this.getCalendar(booking);
    if (!ctx) return { joinLink: null };

    const existing = await this.events.findByBookingAndCalendar(
      booking.id,
      ctx.calendar.id,
    );
    if (existing) {
      this.logger.log(
        `Booking ${booking.id} already mapped to ${existing.externalEventId}`,
      );
      return { joinLink: existing.meetLink };
    }

    try {
      const { externalEventId, joinLink } = await this.api.createEvent(
        ctx.refreshToken,
        booking,
      );
      await this.events.record({
        bookingId: booking.id,
        calendarId: ctx.calendar.id,
        externalEventId,
        meetLink: joinLink,
      });
      await this.logs.record({
        calendarId: ctx.calendar.id,
        bookingId: booking.id,
        operation: 'create_event',
        status: 'success',
        externalEventId,
      });
      await this.calendars.setLastSyncedAt(ctx.calendar.id, new Date());
      await this.calendars.clearLastError(ctx.calendar.id);
      return { joinLink };
    } catch (e) {
      await this.handleSyncFailure(
        ctx.calendar.id,
        booking.id,
        'create_event',
        e,
      );
      return { joinLink: null };
    }
  }

  async cancelBooking(booking: Booking): Promise<void> {
    const event = await this.events.findByBooking(booking.id);
    if (!event) return;

    const ctx = await this.getCalendar(booking);
    if (!ctx) {
      await this.events.deleteById(event.id);
      return;
    }

    try {
      await this.api.deleteEvent(ctx.refreshToken, event.externalEventId);
      await this.events.deleteById(event.id);
      await this.logs.record({
        calendarId: ctx.calendar.id,
        bookingId: booking.id,
        operation: 'delete_event',
        status: 'success',
        externalEventId: event.externalEventId,
      });
      await this.calendars.setLastSyncedAt(ctx.calendar.id, new Date());
      await this.calendars.clearLastError(ctx.calendar.id);
    } catch (e) {
      await this.handleSyncFailure(
        ctx.calendar.id,
        booking.id,
        'delete_event',
        e,
        event.externalEventId,
      );
    }
  }

  // ── Internals ────────────────────────────────────────────────────────────
  private async findForOwner(ownerId: number): Promise<Calendar | null> {
    const business = await this.businesses.findByOwner(ownerId);
    return this.calendars.findByBusinessAndProvider(business.id);
  }

  private async getCalendar(
    booking: Booking,
  ): Promise<{ calendar: Calendar; refreshToken: string } | null> {
    const calendar = await this.calendars.findByBusinessAndProvider(
      booking.service.businessId,
    );
    if (!calendar || calendar.status !== 'connected' || !calendar.refreshToken)
      return null;
    const refreshToken = await this.encryption.decrypt(calendar.refreshToken);
    return { calendar, refreshToken };
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
