import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { ServiceCategory } from '../../service-categories/entities/service-category.entity';
import { Schedule } from '../../schedule/entities/schedule.entity';
import { Location } from '../../locations/entities/location.entity';

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  businessId: number;

  @Column({ nullable: true })
  categoryId: number | null;

  @Column({ name: 'schedule_id', type: 'int' })
  scheduleId: number;

  @ManyToOne(() => Schedule, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'schedule_id' })
  schedule: Schedule;

  @Column({ type: 'varchar', length: 16, default: 'APPOINTMENT' })
  type: 'APPOINTMENT' | 'GROUP';

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'int', default: 1 })
  capacity: number;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ name: 'pause_after_minutes', type: 'int', default: 0 })
  pauseAfterMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: string | null;

  @Column({ name: 'price_type', type: 'varchar', length: 16, default: 'FIXED' })
  priceType: 'FIXED' | 'FROM' | 'FREE' | 'ON_REQUEST';

  @Column({ name: 'location_id', type: 'int' })
  locationId: number;

  @ManyToOne(() => Location, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'location_id' })
  location: Location;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color: string | null;

  @Column({ name: 'photo_url', type: 'text', nullable: true })
  photoUrl: string | null;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'int', default: 0 })
  displayOrder: number;

  @ManyToOne(() => Business, (business) => business.services, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @ManyToOne(() => ServiceCategory, (category) => category.services, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'categoryId' })
  category: ServiceCategory | null;

  @OneToMany(() => Booking, (booking) => booking.service)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
