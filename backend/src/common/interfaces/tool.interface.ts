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
 * Interface for AI tool handlers (legacy - use BaseToolHandler instead)
 * 
 * @deprecated Use BaseToolHandler abstract class with @ToolHandler decorator
 */
export interface IToolHandler {
  /** The name of the tool (e.g., 'services_create') */
  readonly toolName: string;

  /** Get the tool definition for OpenAI API */
  getDefinition(): ToolDefinition;

  /** Handle the tool call and return a result */
  handle(args: Record<string, unknown>, context: ToolContext): Promise<ToolResult>;
}
