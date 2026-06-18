import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import type { Suggestion, ChatCard } from '@bookeasy/shared'; 

export type ChatCompletionMessageParamWithSuggestions = ChatCompletionMessageParam & {
  suggestions?: Suggestion[];
  cards?: ChatCard[]; 
};

export interface Turn {
  /** Live array passed to the provider. The system message is at index 0. */
  readonly history: ChatCompletionMessageParam[];

  /**
   * Append one message. Pushes onto `history` and persists if the
   * backing store is durable. Implementations may run side effects
   * (e.g. auto-title) on first user message.
   */
  append(msg: ChatCompletionMessageParamWithSuggestions): Promise<void>;

  /** Called after the assistant reply is appended. May trim/summarize/touch timestamps. */
  finish(): Promise<void>;
}

export interface ConversationMemory {
  /**
   * Begin a turn. Implementations load any prior history and may augment
   * the system prompt (e.g. prepend a `summary` block).
   */
  begin(
    ownerId: number,
    conversationId: number,
    baseSystemPrompt: string,
  ): Promise<Turn>;
}
