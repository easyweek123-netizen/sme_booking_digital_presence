import { Injectable } from '@nestjs/common';
import { ToolHandler, ToolResult, ToolDefinition, ToolContext } from '../common';
import {
  ListServicesHandler,
  CreateServiceHandler,
  UpdateServiceHandler,
  DeleteServiceHandler,
} from '../services/handlers';

/**
 * Registry for AI tool handlers
 * Routes tool calls to appropriate handlers
 */
@Injectable()
export class ToolRegistry {
  private handlers: Map<string, ToolHandler> = new Map();

  constructor(
    listServicesHandler: ListServicesHandler,
    createServiceHandler: CreateServiceHandler,
    updateServiceHandler: UpdateServiceHandler,
    deleteServiceHandler: DeleteServiceHandler,
  ) {
    // Register all service handlers
    this.register(listServicesHandler);
    this.register(createServiceHandler);
    this.register(updateServiceHandler);
    this.register(deleteServiceHandler);
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
   * Process a tool call with pre-resolved context
   */
  async process(
    toolName: string,
    args: Record<string, unknown>,
    context: ToolContext,
  ): Promise<ToolResult> {
    const handler = this.handlers.get(toolName);

    if (!handler) {
      return {
        success: false,
        error: `Unknown tool: ${toolName}`,
      };
    }

    return handler.handle(args, context);
  }

  /**
   * Check if a tool exists
   */
  hasHandler(toolName: string): boolean {
    return this.handlers.has(toolName);
  }
}

