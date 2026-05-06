import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
  CreateDateColumn,
} from 'typeorm';
import { Conversation } from './conversation.entity';

export type MessageRole = 'system' | 'user' | 'assistant' | 'tool';

@Entity('message')
@Index('IDX_message_conversation_createdAt', ['conversationId', 'createdAt'])
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  conversationId: number;

  @ManyToOne(() => Conversation, (c) => c.messages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation;

  @Column({ type: 'varchar', length: 16 })
  role: MessageRole;

  @Column({ type: 'text' })
  content: string;

  /** Assistant tool_calls payload, JSON-encoded. NULL for non-tool-call rows. */
  @Column({ type: 'text', nullable: true })
  toolCallsJson: string | null;

  /** Assistant quick-reply chips, JSON string. NULL when absent. */
  @Column({ type: 'text', nullable: true })
  suggestions: string | null;

  /** For role='tool' rows, the id of the assistant tool_call this answers. */
  @Column({ type: 'varchar', length: 64, nullable: true })
  toolCallId: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
