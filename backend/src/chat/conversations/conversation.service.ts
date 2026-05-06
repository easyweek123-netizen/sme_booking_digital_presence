import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from '../entities/conversation.entity';
import { Message } from '../entities/message.entity';
import {
  ConversationDto,
} from '../dto/conversation.dto';
import { ChatMessageDto } from '../dto/message.dto';
import type { Suggestion } from '@bookeasy/shared';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversations: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messages: Repository<Message>,
  ) {}

  async list(ownerId: number): Promise<ConversationDto[]> {
    const rows = await this.conversations.find({
      where: { ownerId },
      order: { lastMessageAt: 'DESC', createdAt: 'DESC' },
    });
    return rows.map(toConversationDto);
  }

  async create(ownerId: number): Promise<ConversationDto> {
    const created = await this.conversations.save(
      this.conversations.create({
        ownerId,
        title: 'New chat',
        summary: null,
        lastMessageAt: null,
      }),
    );
    return toConversationDto(created);
  }

  /** Loads the conversation and asserts ownership. Throws on miss/mismatch. */
  async findForOwner(
    ownerId: number,
    conversationId: number,
  ): Promise<Conversation> {
    const row = await this.conversations.findOne({
      where: { id: conversationId },
    });
    if (!row) throw new NotFoundException('Conversation not found');
    if (row.ownerId !== ownerId) {
      throw new ForbiddenException('Not your conversation');
    }
    return row;
  }

  async remove(ownerId: number, conversationId: number): Promise<void> {
    await this.findForOwner(ownerId, conversationId);
    await this.conversations.delete({ id: conversationId });
  }

  /**
   * Returns the user-visible message stream for a conversation.
   * Filters out system + tool rows and assistant rows that are pure
   * tool_call placeholders, so the wire format matches the existing
   * `Message` shape used in chat responses.
   */
  async findMessages(
    ownerId: number,
    conversationId: number,
  ): Promise<ChatMessageDto[]> {
    await this.findForOwner(ownerId, conversationId);
    const rows = await this.messages.find({
      where: { conversationId },
      order: { createdAt: 'ASC', id: 'ASC' },
    });
    return rows
      .filter(
        (r) =>
          (r.role === 'user' && r.content !== '[Chat opened]') ||
          (r.role === 'assistant' && !r.toolCallsJson && r.content),
      )
      .map((r) => ({
        role: r.role === 'user' ? 'user' : 'bot',
        content: r.content,
        suggestions:
          r.role === 'assistant' && r.suggestions
            ? safeParseSuggestions(r.suggestions)
            : undefined,
      }));
  }
}

function safeParseSuggestions(raw: string): Suggestion[] | undefined {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Suggestion[]) : undefined;
  } catch {
    return undefined;
  }
}

function toConversationDto(row: Conversation): ConversationDto {
  return {
    id: row.id,
    title: row.title,
    lastMessageAt: row.lastMessageAt ? row.lastMessageAt.toISOString() : null,
    createdAt: row.createdAt.toISOString(),
  };
}
