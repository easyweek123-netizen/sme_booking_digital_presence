import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  Index,
} from 'typeorm';
import { Owner } from '../../owner/entities/owner.entity';
import { Business } from '../../business/entities/business.entity';
import { Plan } from '../types/enums';

@Entity('billing_event')
@Index('IDX_billing_event_owner_createdAt', ['ownerId', 'createdAt'])
@Index('IDX_billing_event_type', ['eventType'])
export class BillingEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @Column()
  businessId: number;

  @Column({ type: 'varchar', length: 40 })
  eventType: string;

  @Column({ type: 'enum', enum: Plan, enumName: 'plan_enum', nullable: true })
  targetPlan: Plan | null;

  @Column({ type: 'varchar', length: 60, nullable: true })
  sourceFeature: string | null;

  @Column({ type: 'jsonb' })
  metadata: Record<string, unknown>;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @ManyToOne(() => Owner)
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @ManyToOne(() => Business)
  @JoinColumn({ name: 'businessId' })
  business: Business;
}
