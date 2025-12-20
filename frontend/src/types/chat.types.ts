// Re-export all types from shared package
export type {
  ChatAction,
  PreviewContext,
  ServiceFormData,
  ServiceListItem,
  ServiceCreateAction,
  ServiceUpdateAction,
  ServiceDeleteAction,
  ServiceGetAction,
  ExecutionMode,
  ActionType,
  ExtractAction,
  ActionResult,
  ActionResultStatus,
} from '@shared';

/**
 * Suggestion shown in chat
 */
export interface Suggestion {
  label: string;
  value: string;
  icon?: string;
  variant?: 'default' | 'skip';
}

/**
 * Chat message structure (frontend-specific)
 * 
 * Note: `proposals` contains action proposals from AI for canvas rendering.
 */
export interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
  
  /** Action proposals returned by AI for canvas rendering */
  proposals?: import('@shared').ChatAction[];
  
  previewContext?: import('@shared').PreviewContext;
}

/**
 * Request to send action result to backend
 */
export interface ActionResultRequest {
  proposalId: string;
  status: 'confirmed' | 'cancelled' | 'modified';
  result?: Record<string, unknown>;
}
