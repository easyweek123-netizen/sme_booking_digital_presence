import { Injectable } from '@nestjs/common';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { ChatCompletionProvider } from '../providers/chat-completion.provider';

export const CONVERSATION_SUMMARY_PREFIX = '[Conversation summary]';

/** Marks appended summary blocks; used to preserve them across `ensure()` refresh. */
const SUMMARY_SECTION_MARKER = '\n\n## Earlier conversation (summary)\n';

const SUMMARY_SYSTEM_PROMPT = `Summarize the following conversation transcript into one concise paragraph.
Include: what was discussed, what proposals were created or referenced, what was confirmed or cancelled, and key user decisions.
Preserve proposal UUIDs and tool names when present. Be factual; do not invent events.`;

const MAX_MESSAGES_BEFORE_TRIM = 30;
const SUMMARIZE_BATCH = 10;

function hasToolCalls(m: ChatCompletionMessageParam): boolean {
  if (m.role !== 'assistant') return false;
  const toolCalls = (m as { tool_calls?: unknown[] | null }).tool_calls;
  return Array.isArray(toolCalls) && toolCalls.length > 0;
}

/** Drop tool rows that no longer have a parent assistant with tool_calls to their left. */
function stripLeadingToolMessages(
  messages: ChatCompletionMessageParam[],
): ChatCompletionMessageParam[] {
  let start = 0;
  while (start < messages.length && messages[start].role === 'tool') {
    start++;
  }
  return start === 0 ? messages : messages.slice(start);
}

function appendSummaryToSystem(
  system: ChatCompletionMessageParam,
  summaryText: string,
): ChatCompletionMessageParam {
  const block = `${SUMMARY_SECTION_MARKER}${CONVERSATION_SUMMARY_PREFIX}\n${summaryText}`;
  if (system.role !== 'system') {
    return { role: 'system', content: block };
  }
  if (typeof system.content === 'string') {
    return { role: 'system', content: system.content + block };
  }
  if (Array.isArray(system.content)) {
    return {
      role: 'system',
      content: [...system.content, { type: 'text' as const, text: block }],
    };
  }
  return { role: 'system', content: block };
}

/**
 * `ensure` replaces system with a fresh prompt each turn; re-attach any summary
 * archive that was merged into the previous system message.
 */
function mergeFreshSystemPreservingSummaryArchive(
  previous: ChatCompletionMessageParam | undefined,
  fresh: ChatCompletionMessageParam,
): ChatCompletionMessageParam {
  if (!previous || previous.role !== 'system') {
    return fresh;
  }
  const prevStr =
    typeof previous.content === 'string' ? previous.content : '';
  const idx = prevStr.indexOf(SUMMARY_SECTION_MARKER);
  if (idx === -1) {
    return fresh;
  }
  const archive = prevStr.slice(idx);
  if (typeof fresh.content === 'string') {
    return { role: 'system', content: fresh.content + archive };
  }
  if (Array.isArray(fresh.content)) {
    const baseText = fresh.content
      .filter(
        (p): p is { type: 'text'; text: string } =>
          p.type === 'text' && 'text' in p,
      )
      .map((p) => p.text)
      .join('');
    return { role: 'system', content: baseText + archive };
  }
  return { role: 'system', content: archive };
}

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
      history[0] = mergeFreshSystemPreservingSummaryArchive(
        history[0],
        system,
      );
    }
    return history;
  }

  /**
   * When total messages exceed the limit, collapse the oldest batch
   * of non-system messages into summary text merged into the system message.
   *
   * If the batch ends on an assistant with tool_calls, tool results may sit
   * only in `rest`; strip leading `tool` messages so the API transcript stays valid.
   */
  async trimWithSummaryIfNeeded(ownerId: number): Promise<void> {
    const history = this.histories.get(ownerId);
    if (!history || history.length <= MAX_MESSAGES_BEFORE_TRIM) return;

    const toSummarize = history.slice(1, 1 + SUMMARIZE_BATCH);
    let rest = history.slice(1 + SUMMARIZE_BATCH);

    const lastSummarized = toSummarize[toSummarize.length - 1];
    if (lastSummarized && hasToolCalls(lastSummarized)) {
      rest = stripLeadingToolMessages(rest);
    }

    const summaryText = await this.summarizeWindow(toSummarize);

    this.histories.set(ownerId, [
      appendSummaryToSystem(history[0], summaryText),
      ...rest,
    ]);
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
