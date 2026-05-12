import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Calendar } from './calendar.entity';
import { Booking } from '../../bookings/entities/booking.entity';

export type SyncOperation = 'create_event' | 'delete_event';
export type SyncLogStatus = 'success' | 'error';

@Entity('calendar_sync_log')
@Index('IDX_sync_log_calendar_created', ['calendarId', 'createdAt'])
export class CalendarSyncLog {
  @PrimaryGeneratedColumn() id: number;

  @Column() calendarId: number;
  @ManyToOne(() => Calendar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'calendarId' })
  calendar: Calendar;

  @Column({ type: 'int', nullable: true }) bookingId: number | null;
  @ManyToOne(() => Booking, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking | null;

  @Column({ type: 'varchar', length: 30 }) operation: SyncOperation;
  @Column({ type: 'varchar', length: 10 }) status: SyncLogStatus;
  @Column({ type: 'varchar', length: 50, nullable: true }) errorCode:
    | string
    | null;
  @Column({ type: 'text', nullable: true }) errorMessage: string | null;
  @Column({ type: 'varchar', length: 1024, nullable: true }) externalEventId:
    | string
    | null;

  @CreateDateColumn() createdAt: Date;
}
