import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Calendar } from './calendar.entity';

@Entity('calendar_event')
@Unique('UQ_calendar_event_calendar_booking', ['calendarId', 'bookingId'])
@Index('IDX_calendar_event_booking', ['bookingId'])
@Index('IDX_calendar_event_calendar', ['calendarId'])
export class CalendarEvent {
  @PrimaryGeneratedColumn() id: number;

  @Column() bookingId: number;
  @ManyToOne(() => Booking, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'bookingId' })
  booking: Booking;

  @Column() calendarId: number;
  @ManyToOne(() => Calendar, (c) => c.events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'calendarId' })
  calendar: Calendar;

  @Column({ type: 'varchar', length: 1024 }) externalEventId: string;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
