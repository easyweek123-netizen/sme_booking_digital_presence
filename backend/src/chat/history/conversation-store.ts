import { Injectable } from '@nestjs/common';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatCompletionProvider } from '../providers/chat-completion.provider';

export const CONVERSATION_SUMMARY_PREFIX = '[Conversation summary]';

const SUMMARY_SYSTEM_PROMPT = `Summarize the following conversation transcript into one concise paragraph.
Include: what was discussed, what proposals were created or referenced, what was confirmed or cancelled, and key user decisions.
Preserve proposal UUIDs and tool names when present. Be factual; do not invent events.`;

const MAX_MESSAGES_BEFORE_TRIM = 30;
const SUMMARIZE_BATCH = 10;

@Injectable()
export class ConversationStore {
  private readonly histories = new Map<number, ChatCompletionMessageParam[]>();

  constructor(private readonly completionProvider: ChatCompletionProvider) {}

  /**
   * Returns the live history array for this owner,
   * creating it with the system message or refreshing system at index 0.
   */
  ensure(
    ownerId: number,
    system: ChatCompletionMessageParam,
  ): ChatCompletionMessageParam[] {
    let history = this.histories.get(ownerId);
    if (!history) {
      history = [system];
      this.histories.set(ownerId, history);
    } else {
      history[0] = system;
    }
    return history;
  }

  /**
   * When total messages exceed the limit, collapse the oldest batch
   * of non-system messages into a single LLM-generated summary.
   */
  async trimWithSummaryIfNeeded(ownerId: number): Promise<void> {
    const history = this.histories.get(ownerId);
    if (!history || history.length <= MAX_MESSAGES_BEFORE_TRIM) return;

    const toSummarize = history.slice(1, 1 + SUMMARIZE_BATCH);
    const rest = history.slice(1 + SUMMARIZE_BATCH);

    const summaryText = await this.summarizeWindow(toSummarize);

    const trimmed: ChatCompletionMessageParam[] = [
      history[0],
      {
        role: 'assistant',
        content: `${CONVERSATION_SUMMARY_PREFIX}\n${summaryText}`,
      },
      ...rest,
    ];
    this.histories.set(ownerId, trimmed);
  }

  private async summarizeWindow(
    window: ChatCompletionMessageParam[],
  ): Promise<string> {
    const serialized = window
      .map((m) => {
        const c =
          typeof m.content === 'string'
            ? m.content
            : JSON.stringify(m.content);
        return `${m.role}: ${c}`;
      })
      .join('\n---\n');

    const result = await this.completionProvider.complete({
      messages: [
        { role: 'system', content: SUMMARY_SYSTEM_PROMPT },
        { role: 'user', content: serialized },
      ],
    });

    return result.content?.trim() || '(Summary unavailable.)';
  }
}
