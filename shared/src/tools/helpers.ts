import type { ChatAction, PreviewContext } from './index';

// ─────────────────────────────────────────────────────────────────────────────
// Proposal Builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Generate a UUID (works in both Node.js and browsers)
 */
function generateUUID(): string {
  // Use globalThis.crypto for cross-platform compatibility
  if (typeof globalThis.crypto?.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  // Fallback for older environments
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a proposal with auto-generated proposalId
 * Keeps proposal creation consistent across all handlers
 */
export function createProposal<T extends ChatAction>(
  type: T['type'],
  data: Omit<T, 'type' | 'proposalId' | 'executionMode'>,
  options?: { executionMode?: 'confirm' | 'auto' }
): T {
  return {
    type,
    proposalId: generateUUID(),
    executionMode: options?.executionMode ?? 'confirm',
    ...data,
  } as T;
}

// ─────────────────────────────────────────────────────────────────────────────
// ToolResult Builder
// ─────────────────────────────────────────────────────────────────────────────

export interface ToolResultSuccess {
  success: true;
  message: string;
  data?: Record<string, unknown>;
  proposals?: ChatAction[];
  previewContext?: PreviewContext;
}

export interface ToolResultError {
  success: false;
  error: string;
}

export type ToolResultType = ToolResultSuccess | ToolResultError;

/**
 * Helper for building consistent tool results
 */
export const ToolResult = {
  /**
   * Success with a message (no proposals)
   */
  success(message: string, data?: Record<string, unknown>): ToolResultSuccess {
    return { success: true, message, data };
  },

  /**
   * Success with proposals for frontend
   */
  withProposal(
    proposal: ChatAction | ChatAction[],
    message: string,
    previewContext?: PreviewContext
  ): ToolResultSuccess {
    const proposals = Array.isArray(proposal) ? proposal : [proposal];
    return { success: true, message, proposals, previewContext };
  },

  /**
   * Success with data and optional preview switch
   */
  withData(
    message: string,
    data: Record<string, unknown>,
    previewContext?: PreviewContext
  ): ToolResultSuccess {
    return { success: true, message, data, previewContext };
  },

  /**
   * Error result
   */
  error(error: string): ToolResultError {
    return { success: false, error };
  },

  /**
   * Validation error from Zod
   */
  validationError(zodError: { issues: Array<{ message: string }> }): ToolResultError {
    const message = zodError.issues[0]?.message ?? 'Invalid arguments';
    return { success: false, error: message };
  },

  /**
   * Entity not found error
   */
  notFound(entityType: string, identifier: string): ToolResultError {
    return {
      success: false,
      error: `${entityType} "${identifier}" not found`,
    };
  },
};

