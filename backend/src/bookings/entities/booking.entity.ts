import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import { Service } from '../../services/entities/service.entity';
import { Customer } from '../../customers/entities/customer.entity';

export enum BookingStatus {
  PENDING = 'PENDING',       // New booking, awaiting owner confirmation
  CONFIRMED = 'CONFIRMED',   // Owner confirmed the booking
  CANCELLED = 'CANCELLED',   // Cancelled by owner or customer
  COMPLETED = 'COMPLETED',   // Service was delivered
  NO_SHOW = 'NO_SHOW',       // Customer didn't show up
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 10, unique: true })
  reference: string; // e.g., "BK-A3X9" for customer lookup

  @Column()
  businessId: number;

  @Column()
  serviceId: number;

  @Column({ type: 'varchar', length: 100 })
  customerName: string;

  @Column({ type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status: BookingStatus;

  @ManyToOne(() => Business, (business) => business.bookings)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @ManyToOne(() => Service, (service) => service.bookings)
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  customerId: number;

  @ManyToOne(() => Customer, (customer) => customer.bookings)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @CreateDateColumn()
  createdAt: Date;
}
