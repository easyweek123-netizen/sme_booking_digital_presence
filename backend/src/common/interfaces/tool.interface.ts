/**
 * Result returned by a tool handler
 */
export interface ToolResult {
  success: boolean;
  data?: Record<string, unknown>;
  error?: string;
}

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
 * Interface for AI tool handlers
 * Each domain module can implement this to handle specific tools
 */
export interface ToolHandler {
  /** The name of the tool (e.g., 'manage_service') */
  readonly toolName: string;

  /** Get the tool definition for OpenAI API */
  getDefinition(): ToolDefinition;

  /** Handle the tool call and return a result */
  handle(args: Record<string, unknown>, ownerId: number): Promise<ToolResult>;
}

