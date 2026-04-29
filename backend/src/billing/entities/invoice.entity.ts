import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { InvoiceStatus } from '../types/enums';
import { Subscription } from './subscription.entity';

@Entity('invoice')
@Index('IDX_invoice_subscription_createdAt', ['subscriptionId', 'createdAt'])
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subscriptionId: number;

  @Column({ type: 'varchar', length: 120, unique: true })
  providerInvoiceId: string;

  @Column()
  amountCents: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'enum', enum: InvoiceStatus, enumName: 'invoice_status' })
  status: InvoiceStatus;

  @Column({ type: 'timestamp' })
  periodStart: Date;

  @Column({ type: 'timestamp' })
  periodEnd: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt: Date | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  hostedUrl: string | null;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @ManyToOne(() => Subscription, (subscription) => subscription.invoices)
  @JoinColumn({ name: 'subscriptionId' })
  subscription: Subscription;
}
