import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Availability } from './availability.entity';

@Entity('schedule')
@Index('idx_schedule_business', ['businessId'])
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'business_id', type: 'int' })
  businessId: number;

  @Column({ type: 'varchar', length: 120, default: 'Default' })
  name: string;

  @Column({ type: 'varchar', length: 64, nullable: true })
  timezone: string | null;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'business_id' })
  business: Business;

  @OneToMany(() => Availability, (a) => a.schedule)
  availabilities: Availability[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
