import type { ChatAction, PreviewContext, Suggestion, ChatCard, Wizard } from '@shared';

/**
 * Chat message structure (frontend-specific)
 *
 * Note: `proposals` contains action proposals from AI for canvas rendering.
 */
export interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
  proposals?: ChatAction[];
  previewContext?: PreviewContext;
  cards?: ChatCard[];
  wizard?: Wizard;
}

/**
 * Request to send action result to backend
 */
export interface ActionResultRequest {
  conversationId: number;
  proposalId: string;
  status: 'confirmed' | 'cancelled' | 'modified';
  result?: Record<string, unknown>;
  wizard?: { stepId?: string };
}

export interface Conversation {
  id: number;
  title: string;
  lastMessageAt: string | null;
  createdAt: string;
}
