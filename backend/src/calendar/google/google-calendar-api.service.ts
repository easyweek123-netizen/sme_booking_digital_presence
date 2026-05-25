import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';
import { Booking } from '../../bookings/entities/booking.entity';
import { LocationType } from '../../services/entities/service.entity';
import { toLocalIsoDateTime } from '../../common';

export interface CalendarEventResult {
  externalEventId: string;
  joinLink: string | null;
}

export class GoogleCalendarApiError extends Error {
  constructor(
    message: string,
    public readonly code: 'invalid_grant' | 'not_found' | 'unknown',
    public readonly cause?: unknown,
  ) {
    super(message);
  }
}

@Injectable()
export class GoogleCalendarApiService {
  private readonly logger = new Logger(GoogleCalendarApiService.name);
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly frontendUrl: string;

  constructor(config: ConfigService) {
    this.clientId = config.get<string>('calendar.google.clientId') || '';
    this.clientSecret =
      config.get<string>('calendar.google.clientSecret') || '';
    this.redirectUri = config.get<string>('calendar.google.redirectUri') || '';
    this.frontendUrl = config.get<string>('calendar.frontendUrl') || '';
  }

  async createEvent(
    refreshToken: string,
    booking: Booking,
  ): Promise<CalendarEventResult> {
    const calendar = this.calendarClient(refreshToken);
    const withMeeting = booking.service?.locationType === LocationType.ONLINE;
    try {
      const res = await calendar.events.insert({
        calendarId: 'primary',
        conferenceDataVersion: withMeeting ? 1 : 0,
        requestBody: this.toRequestBody(booking, withMeeting),
      });
      const externalEventId = res.data.id;
      if (!externalEventId) {
        throw new GoogleCalendarApiError('No event id returned', 'unknown');
      }
      return { externalEventId, joinLink: res.data.hangoutLink ?? null };
    } catch (e) {
      throw this.toApiError(e);
    }
  }

  async deleteEvent(
    refreshToken: string,
    externalEventId: string,
  ): Promise<void> {
    const calendar = this.calendarClient(refreshToken);
    try {
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: externalEventId,
      });
    } catch (e) {
      const apiError = this.toApiError(e);
      if (apiError.code === 'not_found') {
        this.logger.warn(
          `Event ${externalEventId} already gone in Google; treating delete as success`,
        );
        return;
      }
      throw apiError;
    }
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  private toRequestBody(
    booking: Booking,
    withMeeting: boolean,
  ): calendar_v3.Schema$Event {
    const service = booking.service;
    const business = service?.business;
    const timeZone = business?.timezone ?? 'Europe/Vienna';

    const description = [
      `Booking ${booking.reference}`,
      ...(booking.customerEmail ? [`Email: ${booking.customerEmail}`] : []),
      ...(business?.phone ? [`Phone: ${business.phone}`] : []),
      '',
      `Manage in BookEasy: ${this.frontendUrl}/dashboard/bookings/${booking.id}`,
    ].join('\n');

    return {
      summary: `${booking.customerName} — ${service?.name ?? 'Booking'}`,
      description,
      location: withMeeting ? undefined : (business?.address ?? undefined),
      start: {
        dateTime: toLocalIsoDateTime(booking.date, booking.startTime),
        timeZone,
      },
      end: {
        dateTime: toLocalIsoDateTime(booking.date, booking.endTime),
        timeZone,
      },
      reminders: { useDefault: true },
      conferenceData: withMeeting
        ? {
            createRequest: {
              requestId: `booking-${booking.id}-${Date.now()}`,
              conferenceSolutionKey: { type: 'hangoutsMeet' },
            },
          }
        : undefined,
    };
  }

  private calendarClient(refreshToken: string): calendar_v3.Calendar {
    const oauth = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri,
    );
    oauth.setCredentials({ refresh_token: refreshToken });
    return google.calendar({ version: 'v3', auth: oauth });
  }

  private toApiError(err: unknown): GoogleCalendarApiError {
    const e = err as {
      response?: { status?: number; data?: { error?: string } };
      code?: number;
      message?: string;
    };
    const status = e?.response?.status ?? e?.code;
    const googleError = e?.response?.data?.error;
    if (googleError === 'invalid_grant' || status === 401) {
      return new GoogleCalendarApiError(
        'Refresh token revoked',
        'invalid_grant',
        err,
      );
    }
    if (status === 404 || status === 410) {
      return new GoogleCalendarApiError('Event not found', 'not_found', err);
    }
    return new GoogleCalendarApiError(
      e?.message ?? 'Google Calendar API error',
      'unknown',
      err,
    );
  }
}
