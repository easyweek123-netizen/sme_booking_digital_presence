import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Schedule } from './schedule.entity';

@Entity('availability')
@Index('idx_avail_schedule_recur', ['scheduleId', 'isRecurring', 'dayOfWeek'])
@Index('idx_avail_schedule_date', ['scheduleId', 'date'])
export class Availability {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'schedule_id', type: 'int' })
  scheduleId: number;

  @Column({ name: 'is_recurring', type: 'boolean' })
  isRecurring: boolean;

  @Column({ name: 'day_of_week', type: 'smallint', nullable: true })
  dayOfWeek: number | null;

  @Column({ type: 'date', nullable: true })
  date: string | null;

  @Column({ name: 'start_time', type: 'time', nullable: true })
  startTime: string | null;

  @Column({ name: 'end_time', type: 'time', nullable: true })
  endTime: string | null;

  @Column({ name: 'is_closed', type: 'boolean', default: false })
  isClosed: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Schedule, (s) => s.availabilities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;
}
