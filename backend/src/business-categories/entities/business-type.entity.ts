import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { BusinessCategory } from './business-category.entity';
import { Business } from '../../business/entities/business.entity';

@Entity('business_types')
export class BusinessType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  categoryId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => BusinessCategory, (category) => category.types)
  @JoinColumn({ name: 'categoryId' })
  category: BusinessCategory;

  @OneToMany(() => Business, (business) => business.businessType)
  businesses: Business[];

  @CreateDateColumn()
  createdAt: Date;
}

