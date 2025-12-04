import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { BusinessType } from './business-type.entity';

@Entity('business_categories')
export class BusinessCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  icon: string;

  @Column({ type: 'varchar', length: 20 })
  color: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => BusinessType, (type) => type.category)
  types: BusinessType[];

  @CreateDateColumn()
  createdAt: Date;
}
