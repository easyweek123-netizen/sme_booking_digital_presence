import type { ChatAction, PreviewContext, Suggestion } from '@shared';

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
}

/**
 * Request to send action result to backend
 */
export interface ActionResultRequest {
  proposalId: string;
  status: 'confirmed' | 'cancelled' | 'modified';
  result?: Record<string, unknown>;
}
