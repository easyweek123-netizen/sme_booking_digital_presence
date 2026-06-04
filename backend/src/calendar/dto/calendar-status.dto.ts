export interface CalendarStatusDto {
  /** Database id of the Calendar row — null when not connected. */
  calendarId: number | null;
  connected: boolean;
  email: string | null;
  lastSyncAt: string | null;
  status: 'connected' | 'error' | 'disconnected' | null;
}
