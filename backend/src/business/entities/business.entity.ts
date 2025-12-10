import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Owner } from '../../owner/entities/owner.entity';
import { BusinessType } from '../../business-categories/entities/business-type.entity';
import { Service } from '../../services/entities/service.entity';
import { Booking } from '../../bookings/entities/booking.entity';
import { WorkingHours } from '../../common/types';

@Entity('businesses')
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
  address: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  instagram: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  logoUrl: string | null;

  @Column({ type: 'varchar', length: 7, nullable: true })
  brandColor: string | null;

  @Column({ type: 'json', nullable: true })
  workingHours: WorkingHours | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  coverImageUrl: string | null;

  @Column({ type: 'text', nullable: true })
  aboutContent: string | null;

  @ManyToOne(() => Owner, (owner) => owner.businesses)
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @ManyToOne(() => BusinessType, (type) => type.businesses, { nullable: true })
  @JoinColumn({ name: 'businessTypeId' })
  businessType: BusinessType | null;

  @OneToMany(() => Service, (service) => service.business)
  services: Service[];

  @OneToMany(() => Booking, (booking) => booking.business)
  bookings: Booking[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
