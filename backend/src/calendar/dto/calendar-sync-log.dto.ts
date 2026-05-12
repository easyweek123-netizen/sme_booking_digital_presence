export interface CalendarSyncLogDto {
  id: number;
  operation: 'create_event' | 'delete_event';
  status: 'success' | 'error';
  errorCode: string | null;
  errorMessage: string | null;
  externalEventId: string | null;
  createdAt: string;
}
