import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Calendar } from '../../calendar/entities/calendar.entity';

export enum LocationType {
  ADDRESS = 'ADDRESS',
  PHONE = 'PHONE',
  ONLINE = 'ONLINE',
}

@Entity('locations')
@Check(
  'CHK_location_type_fields',
  `(
    (type = 'ADDRESS' AND line1 IS NOT NULL AND city IS NOT NULL
                      AND country_code IS NOT NULL AND latitude IS NOT NULL AND longitude IS NOT NULL) OR
    (type = 'PHONE'   AND phone_number IS NOT NULL) OR
    (type = 'ONLINE'  AND calendar_id IS NOT NULL)
  )`,
)
@Index('IDX_locations_business', ['businessId'])
export class Location {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  businessId: number;

  @ManyToOne(() => Business, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @Column({ type: 'varchar', length: 16 })
  type: LocationType;

  @Column({ type: 'varchar', length: 80, nullable: true })
  label: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  verifiedAt: Date | null;

  // ADDRESS
  @Column({ type: 'varchar', length: 255, nullable: true })
  line1: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  line2: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 16, nullable: true })
  postalCode: string | null;

  @Column({ name: 'country_code', type: 'varchar', length: 2, nullable: true })
  countryCode: string | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  latitude: string | null;

  @Column({ type: 'decimal', precision: 9, scale: 6, nullable: true })
  longitude: string | null;

  // PHONE — stored E.164
  @Column({ name: 'phone_number', type: 'varchar', length: 20, nullable: true })
  phoneNumber: string | null;

  // ONLINE
  @Column({ name: 'calendar_id', type: 'int', nullable: true })
  calendarId: number | null;

  @ManyToOne(() => Calendar, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'calendar_id' })
  calendar: Calendar | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
