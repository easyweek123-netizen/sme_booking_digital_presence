import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Message, type MessageRole } from '../entities/message.entity';
import { Conversation } from '../entities/conversation.entity';
import type { ChatCompletionMessageParamWithSuggestions } from '../memory/conversation-memory';

const HISTORY_LIMIT = 30;

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messages: Repository<Message>,
    @InjectRepository(Conversation)
    private readonly conversations: Repository<Conversation>,
  ) {}

  /** Last `limit` messages for `conversationId`, oldest-first, in provider shape. */
  async loadRecent(
    conversationId: number,
    limit = HISTORY_LIMIT,
  ): Promise<ChatCompletionMessageParam[]> {
    const rows = await this.messages.find({
      where: { conversationId },
      order: { createdAt: 'DESC', id: 'DESC' },
      take: limit,
    });
    return rows.reverse().map(toProviderMessage);
  }

  /**
   * Append one message. Does NOT touch `conversation.lastMessageAt` per
   * row — the memory layer bumps it once per turn in `finish()`.
   */
  async append(
    conversationId: number,
    msg: ChatCompletionMessageParamWithSuggestions,
  ): Promise<void> {
    const row = this.messages.create(toMessageRow(conversationId, msg));
    await this.messages.save(row);
  }

  async touchLastMessageAt(conversationId: number, when: Date): Promise<void> {
    await this.conversations.update(
      { id: conversationId },
      { lastMessageAt: when },
    );
  }
}

// ── row ↔ provider shape ─────────────────────────────────────────────

function toProviderMessage(row: Message): ChatCompletionMessageParam {
  switch (row.role) {
    case 'tool':
      return {
        role: 'tool',
        tool_call_id: row.toolCallId ?? '',
        content: row.content,
      };
    case 'assistant':
      if (row.toolCallsJson) {
        return {
          role: 'assistant',
          content: row.content || null,
          tool_calls: JSON.parse(row.toolCallsJson),
        };
      }
      return { role: 'assistant', content: row.content };
    case 'user':
      return { role: 'user', content: row.content };
    case 'system':
    default:
      return { role: 'system', content: row.content };
  }
}

function toMessageRow(
  conversationId: number,
  msg: ChatCompletionMessageParamWithSuggestions,
): Partial<Message> {
  if (msg.role === 'tool') {
    return {
      conversationId,
      role: 'tool',
      content:
        typeof msg.content === 'string'
          ? msg.content
          : JSON.stringify(msg.content),
      toolCallId: (msg as { tool_call_id?: string }).tool_call_id ?? null,
      toolCallsJson: null,
      suggestions: null,
      cards: null,
    };
  }
  if (msg.role === 'assistant') {
    const toolCalls = (msg as { tool_calls?: unknown[] }).tool_calls;
    const hasToolCalls = Array.isArray(toolCalls) && toolCalls.length > 0;
    return {
      conversationId,
      role: 'assistant',
      content: typeof msg.content === 'string' ? msg.content : '',
      toolCallsJson: hasToolCalls ? JSON.stringify(toolCalls) : null,
      toolCallId: null,
      suggestions:
        msg.suggestions && msg.suggestions.length > 0
          ? JSON.stringify(msg.suggestions)
          : null,
      cards: msg.cards && msg.cards.length > 0 ? JSON.stringify(msg.cards) : null,
    };
  }
  return {
    conversationId,
    role: msg.role as MessageRole,
    content:
      typeof msg.content === 'string'
        ? msg.content
        : JSON.stringify(msg.content),
    toolCallId: null,
    toolCallsJson: null,
    suggestions: null,
  };
}
