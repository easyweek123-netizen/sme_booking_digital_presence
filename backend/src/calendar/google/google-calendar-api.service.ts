import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, calendar_v3 } from 'googleapis';

export interface GoogleEventInput {
  summary: string;
  description?: string;
  location?: string;
  startDateTime: string; // 'YYYY-MM-DDTHH:MM:SS', no offset
  endDateTime: string;
  timeZone: string; // IANA, e.g. 'Europe/Vienna'
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

  constructor(config: ConfigService) {
    this.clientId = config.get<string>('calendar.google.clientId') || '';
    this.clientSecret =
      config.get<string>('calendar.google.clientSecret') || '';
    this.redirectUri = config.get<string>('calendar.google.redirectUri') || '';
  }

  async createEvent(
    refreshToken: string,
    input: GoogleEventInput,
  ): Promise<string> {
    const calendar = this.calendarClient(refreshToken);
    try {
      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: this.toRequestBody(input),
      });
      const id = res.data.id;
      if (!id)
        throw new GoogleCalendarApiError('No event id returned', 'unknown');
      return id;
    } catch (e) {
      throw this.wrap(e);
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
      const wrapped = this.wrap(e);
      if (wrapped.code === 'not_found') {
        this.logger.warn(
          `Event ${externalEventId} already gone in Google; treating delete as success`,
        );
        return;
      }
      throw wrapped;
    }
  }

  // ── Internals ─────────────────────────────────────────────────────────────

  private calendarClient(refreshToken: string): calendar_v3.Calendar {
    const oauth = new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri,
    );
    oauth.setCredentials({ refresh_token: refreshToken });
    return google.calendar({ version: 'v3', auth: oauth });
  }

  private toRequestBody(input: GoogleEventInput): calendar_v3.Schema$Event {
    return {
      summary: input.summary,
      description: input.description,
      location: input.location || undefined,
      start: { dateTime: input.startDateTime, timeZone: input.timeZone },
      end: { dateTime: input.endDateTime, timeZone: input.timeZone },
      reminders: { useDefault: true },
    };
  }

  private wrap(err: unknown): GoogleCalendarApiError {
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
