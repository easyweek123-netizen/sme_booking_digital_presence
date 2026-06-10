import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
} from 'typeorm';
import { Owner } from '../../owner/entities/owner.entity';
import { BusinessType } from '../../business-categories/entities/business-type.entity';
import { Service } from '../../services/entities/service.entity';
import { Plan } from '../../billing/types/enums';
import { Subscription } from '../../billing/entities/subscription.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity('business')
@Index('IDX_business_plan', ['plan'])
export class Business {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column({ nullable: true })
  businessTypeId: number | null;

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true })
  brandColor: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'varchar', length: 64, default: 'Europe/Vienna' })
  timezone: string;

  @Column({ type: 'text', nullable: true })
  aboutContent: string | null;

  @Column({ name: 'show_next_available', type: 'boolean', default: true })
  showNextAvailable: boolean;

  @Column({ name: 'show_weekly_hours', type: 'boolean', default: true })
  showWeeklyHours: boolean;

  @Column({
    type: 'enum',
    enum: Plan,
    enumName: 'plan_enum',
    default: Plan.FREE,
  })
  plan: Plan;

  @Column({ type: 'varchar', length: 120, nullable: true, unique: true })
  providerCustomerId: string | null;

  @Column({ name: 'default_schedule_id', type: 'int', nullable: true })
  defaultScheduleId: number | null;

  @ManyToOne(() => Schedule, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'default_schedule_id' })
  defaultSchedule: Schedule | null;

  @OneToMany(() => Location, (location) => location.business)
  locations: Location[];

  @OneToOne(() => Subscription, (subscription) => subscription.business, {
    nullable: true,
  })
  subscription: Subscription | null;

  @ManyToOne(() => Owner, (owner) => owner.businesses)
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @ManyToOne(() => BusinessType, (type) => type.businesses, { nullable: true })
  @JoinColumn({ name: 'businessTypeId' })
  businessType: BusinessType | null;

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
