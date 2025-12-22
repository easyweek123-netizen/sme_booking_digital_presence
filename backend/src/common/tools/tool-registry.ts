import { Injectable, Logger } from '@nestjs/common';
import type { ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../interfaces/tool.interface';
import type { BaseToolHandler } from './base-tool.handler';

/**
 * Simple Tool Registry
 * 
 * Manages tool handlers with explicit registration.
 * No auto-discovery magic - handlers are injected directly via useFactory.
 */
@Injectable()
export class ToolRegistry {
  private readonly logger = new Logger(ToolRegistry.name);
  private readonly handlers = new Map<string, BaseToolHandler>();

  /**
   * Initialize registry with handlers array.
   * Called by the factory provider in ToolsModule.
   */
  registerHandlers(handlers: BaseToolHandler[]): void {
    for (const handler of handlers) {
      const name = handler.toolName;
      this.handlers.set(name, handler);
      this.logger.log(`Registered tool: ${name}`);
    }
    this.logger.log(`Registered ${this.handlers.size} tool handlers`);
  }

  /**
   * Get all tool definitions for OpenAI API
   */
  getToolDefinitions(): Array<{
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
  }> {
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
    context: ToolContext,
  ): Promise<ToolResult> {
    const handler = this.handlers.get(toolName);

    if (!handler) {
      this.logger.warn(`Unknown tool: ${toolName}`);
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

  /**
   * Get all registered tool names
   */
  getToolNames(): string[] {
    return Array.from(this.handlers.keys());
  }
}

