import type { ToolResult } from '@bookeasy/shared';

// Re-export ToolResult from shared for convenience
export type { ToolResult } from '@bookeasy/shared';

/**
 * OpenAI-compatible tool definition
 */
export interface ToolDefinition {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, unknown>;
      required?: string[];
    };
  };
}

/**
 * Context passed to tool handlers
 * Pre-resolved by ChatService before calling handlers
 */
export interface ToolContext {
  /** Owner ID (from authenticated user) */
  ownerId: number;
  
  /** Business ID (pre-resolved from owner) */
  businessId: number;
}

/**
 * Interface for AI tool handlers
 * Each domain module can implement this to handle specific tools
 * 
 * Tool handlers are self-contained:
 * - Define their own tool definition (for AI API)
 * - Handle execution with pre-resolved context
 * - Return proposals for frontend rendering
 * 
 * Fine-grained tools pattern:
 * - One handler per operation (e.g., 'services_list', 'services_create')
 * - Entity resolution by name (backend resolves to ID)
 * - Proposals include proposalId for confirmation tracking
 */
export interface ToolHandler {
  /** The name of the tool (e.g., 'services_create') */
  readonly toolName: string;

  /** Get the tool definition for OpenAI API */
  getDefinition(): ToolDefinition;

  /** 
   * Handle the tool call and return a result.
   * The result includes:
   * - success: whether the operation succeeded
   * - message: text for AI to use in response
   * - proposals: action proposals for frontend to render
   * - previewContext: which preview to show
   */
  handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}

