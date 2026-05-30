import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { CalendarEvent } from './calendar-event.entity';

export type CalendarProvider = 'google';
export type CalendarStatus = 'connected' | 'error' | 'disconnected';

@Entity('calendar')
@Unique('UQ_calendar_business_provider', ['businessId', 'provider'])
export class Calendar {
  @PrimaryGeneratedColumn() id: number;

  @Column() businessId: number;
  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column({ type: 'varchar', length: 20 }) provider: CalendarProvider;
  @Column({ type: 'varchar', length: 255, nullable: true })
  providerAccountEmail: string | null;
  @Column({ type: 'text', nullable: true }) refreshToken: string | null;
  @Column({ type: 'text', nullable: true }) scope: string | null;
  @Column({ type: 'varchar', length: 20, default: 'disconnected' })
  status: CalendarStatus;
  @Column({ type: 'text', nullable: true }) lastError: string | null;
  @Column({ type: 'timestamp', nullable: true }) lastSyncAt: Date | null;
  @Column({ type: 'timestamp', nullable: true }) disconnectedAt: Date | null;

  @OneToMany(() => CalendarEvent, (e) => e.calendar) events: CalendarEvent[];

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}
