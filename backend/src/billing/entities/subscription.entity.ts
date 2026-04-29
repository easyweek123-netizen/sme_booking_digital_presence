import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import {
  BillingCycle,
  BillingProviderId,
  Plan,
  SubStatus,
} from '../types/enums';
import { Invoice } from './invoice.entity';

@Entity('subscription')
@Index('IDX_subscription_status', ['status'])
@Index('IDX_subscription_periodEnd', ['currentPeriodEnd'])
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  businessId: number;

  @Column({
    type: 'enum',
    enum: BillingProviderId,
    enumName: 'billing_provider_id',
  })
  provider: BillingProviderId;

  @Column({ type: 'varchar', length: 120, unique: true })
  providerSubId: string;

  @Column({ type: 'enum', enum: Plan, enumName: 'plan_enum' })
  plan: Plan;

  @Column({ type: 'enum', enum: BillingCycle, enumName: 'billing_cycle' })
  cycle: BillingCycle;

  @Column({ type: 'enum', enum: SubStatus, enumName: 'sub_status' })
  status: SubStatus;

  @Column({ type: 'timestamp' })
  currentPeriodStart: Date;

  @Column({ type: 'timestamp' })
  currentPeriodEnd: Date;

  @Column({ type: 'boolean', default: false })
  cancelAtPeriodEnd: boolean;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;

  @OneToOne(() => Business, (business) => business.subscription)
  @JoinColumn({ name: 'businessId' })
  business: Business;

  @OneToMany(() => Invoice, (invoice) => invoice.subscription)
  invoices: Invoice[];
}
