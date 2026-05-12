export type CalendarSyncStatus = 'connected' | 'error' | 'disconnected' | null;

export interface CalendarStatus {
  connected: boolean;
  email: string | null;
  lastSyncAt: string | null;
  status: CalendarSyncStatus;
}

export type SyncOperation = 'create_event' | 'delete_event';
export type SyncEventStatus = 'success' | 'error';

export interface CalendarSyncLog {
  id: number;
  operation: SyncOperation;
  status: SyncEventStatus;
  errorCode: string | null;
  errorMessage: string | null;
  externalEventId: string | null;
  createdAt: string;
}
