export interface Availability {
  id: number;
  scheduleId: number;
  isRecurring: boolean;
  dayOfWeek: number | null;
  date: string | null;
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
  createdAt: string;
}
