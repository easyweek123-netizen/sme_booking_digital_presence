import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { Conversation } from '../entities/conversation.entity';
import { MessageRepository } from '../repositories/message.repository';
import type {
  ChatCompletionMessageParamWithSuggestions,
  ConversationMemory,
  Turn,
} from './conversation-memory';

const DEFAULT_TITLE = 'New chat';
const TITLE_MAX = 60;

@Injectable()
export class PersistentConversationMemory implements ConversationMemory {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversations: Repository<Conversation>,
    private readonly messages: MessageRepository,
  ) {}

  async begin(
    ownerId: number,
    conversationId: number,
    baseSystemPrompt: string,
  ): Promise<Turn> {
    // ONE round-trip: id + ownerId + title + summary in one row.
    const conversation = await this.conversations.findOne({
      where: { id: conversationId },
      select: ['id', 'ownerId', 'title', 'summary'],
    });
    if (!conversation) {
      throw new NotFoundException('Conversation not found');
    }
    if (conversation.ownerId !== ownerId) {
      throw new ForbiddenException('Not your conversation');
    }

    const systemPromptWithSummary = conversation.summary
      ? `${baseSystemPrompt}\n\n## Earlier conversation (summary)\n${conversation.summary}`
      : baseSystemPrompt;

    const recent = await this.messages.loadRecent(conversationId);
    const history: ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPromptWithSummary },
      ...recent,
    ];

    let titled = conversation.title !== DEFAULT_TITLE;
    let appended = false;
    let lastAppendAt: Date | null = null;

    return {
      history,

      append: async (msg: ChatCompletionMessageParamWithSuggestions) => {
        const { suggestions: _suggestions, ...providerMsg } = msg;
        history.push(providerMsg);
        await this.messages.append(conversationId, msg);
        appended = true;
        lastAppendAt = new Date();

        // Auto-title on the first real user message of the conversation.
        if (
          !titled &&
          msg.role === 'user' &&
          typeof msg.content === 'string' &&
          !isInternalMarker(msg.content)
        ) {
          const next = deriveTitle(msg.content);
          if (next) {
            await this.conversations.update({ id: conversationId }, { title: next });
            titled = true;
          }
        }
      },

      finish: async () => {
        // One bump per turn instead of one per appended row.
        if (appended && lastAppendAt) {
          await this.messages.touchLastMessageAt(conversationId, lastAppendAt);
        }
      },
    };
  }
}

/** `[Chat opened]`, `[Action confirmed: ...]`, `[Action cancelled: ...]` etc. */
function isInternalMarker(text: string): boolean {
  const trimmed = text.trim();
  return trimmed.startsWith('[') && trimmed.endsWith(']');
}

function deriveTitle(rawText: string): string | null {
  const trimmed = rawText.trim().replace(/\s+/g, ' ');
  if (!trimmed) return null;
  return trimmed.length > TITLE_MAX
    ? trimmed.slice(0, TITLE_MAX - 1).trimEnd() + '…'
    : trimmed;
}
