import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BillingCycle, Plan } from '../types/enums';

@Entity('pricing_plan')
export class PricingPlan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: Plan, enumName: 'plan_enum' })
  plan: Plan;

  @Column({ type: 'enum', enum: BillingCycle, enumName: 'billing_cycle' })
  cycle: BillingCycle;

  @Column()
  amountCents: number;

  @Column({ type: 'varchar', length: 3, default: 'EUR' })
  currency: string;

  @Column({ type: 'varchar', length: 120, nullable: true })
  stripePriceId: string | null;

  @Column({ type: 'jsonb' })
  features: string[];

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
