import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import type { UsageCounter } from '../../entitlements/counters/usage-counter.interface';

@Injectable()
export class ConversationCounter implements UsageCounter {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversations: Repository<Conversation>,
  ) {}

  async count({ ownerId }: { ownerId: number; businessId: number }): Promise<number> {
    return this.conversations.count({ where: { ownerId } });
  }
}
