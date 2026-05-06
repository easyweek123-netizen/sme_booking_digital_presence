import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Owner } from '../../owner/entities/owner.entity';
import { Message } from './message.entity';

@Entity('conversation')
@Index('IDX_conversation_owner_lastMessage', ['ownerId', 'lastMessageAt'])
export class Conversation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ownerId: number;

  @ManyToOne(() => Owner, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: Owner;

  @Column({ type: 'varchar', length: 80 })
  title: string;

  /**
   * Compacted history of older turns. Prepended to the system prompt
   * when present.
   */
  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'timestamp', nullable: true })
  lastMessageAt: Date | null;

  @OneToMany(() => Message, (m) => m.conversation)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
