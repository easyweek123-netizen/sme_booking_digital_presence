import { Injectable } from '@nestjs/common';
import { ToolHandler, ToolResult, ToolDefinition } from '../common';
import { ServiceToolHandler } from '../services/service.tool-handler';

/**
 * Registry for AI tool handlers
 * Routes tool calls to appropriate handlers
 */
@Injectable()
export class ToolRegistry {
  private handlers: Map<string, ToolHandler> = new Map();

  constructor(private serviceToolHandler: ServiceToolHandler) {
    this.register(serviceToolHandler);
  }

  /**
   * Register a tool handler
   */
  private register(handler: ToolHandler): void {
    this.handlers.set(handler.toolName, handler);
  }

  /**
   * Get all tool definitions for OpenAI API
   * Dynamically collects definitions from all registered handlers
   */
  getToolDefinitions(): ToolDefinition[] {
    return Array.from(this.handlers.values()).map((handler) =>
      handler.getDefinition(),
    );
  }

  /**
   * Process a tool call
   */
  async process(
    toolName: string,
    args: Record<string, unknown>,
    ownerId: number,
  ): Promise<ToolResult> {
    const handler = this.handlers.get(toolName);

    if (!handler) {
      return {
        success: false,
        error: `Unknown tool: ${toolName}`,
      };
    }

    return handler.handle(args, ownerId);
  }

  /**
   * Check if a tool exists
   */
  hasHandler(toolName: string): boolean {
    return this.handlers.has(toolName);
  }
}

