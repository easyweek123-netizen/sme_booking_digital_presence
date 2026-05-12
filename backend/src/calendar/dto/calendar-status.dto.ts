export interface CalendarStatusDto {
  connected: boolean;
  email: string | null;
  lastSyncAt: string | null;
  status: 'connected' | 'error' | 'disconnected' | null;
}
