import { Logger } from '@nestjs/common';
import type { z } from 'zod';
import type { ToolResult } from '@bookeasy/shared';
import { ToolResultHelpers } from '@bookeasy/shared';
import type { ToolContext } from '../interfaces/tool.interface';
import { getToolOptions } from './tool-handler.decorator';
import { zodToOpenAISchema } from './schema-utils';

/**
 * Base class for all tool handlers.
 * Provides shared functionality:
 * - Zod validation of arguments
 * - Error handling and logging
 * - Tool definition generation
 * 
 * Subclasses must:
 * 1. Use @ToolHandler decorator with name, description, parameters
 * 2. Define a `schema` property for argument validation
 * 3. Implement `execute()` method
 * 
 * @example
 * ```typescript
 * @ToolHandler({
 *   name: 'services_create',
 *   description: 'Create a new service',
 *   parameters: { type: 'object', properties: {...}, required: [...] },
 * })
 * @Injectable()
 * export class CreateServiceTool extends BaseToolHandler<CreateArgs> {
 *   schema = CreateArgsSchema;
 *   
 *   async execute(args: CreateArgs, ctx: ToolContext) {
 *     return ToolResult.withProposal(...);
 *   }
 * }
 * ```
 */
export abstract class BaseToolHandler<TArgs = unknown> {
  protected readonly logger = new Logger(this.constructor.name);

  /** Zod schema for validating arguments */
  abstract readonly schema: z.ZodSchema<TArgs>;

  /** Execute the tool with validated arguments */
  abstract execute(args: TArgs, ctx: ToolContext): Promise<ToolResult>;

  /**
   * Get the tool name from decorator metadata
   */
  get toolName(): string {
    const options = getToolOptions(this.constructor);
    if (!options) {
      throw new Error(`${this.constructor.name} is missing @ToolHandler decorator`);
    }
    return options.name;
  }

  /**
   * Get the OpenAI tool definition.
   * Parameters are auto-generated from the Zod schema.
   */
  getDefinition(): {
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
  } {
    const options = getToolOptions(this.constructor);
    if (!options) {
      throw new Error(`${this.constructor.name} is missing @ToolHandler decorator`);
    }

    return {
      type: 'function',
      function: {
        name: options.name,
        description: options.description,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        parameters: zodToOpenAISchema(this.schema as any),
      },
    };
  }

  /**
   * Handle a tool call: validate arguments, execute, handle errors.
   * This is the main entry point called by ToolRegistry.
   */
  async handle(args: Record<string, unknown>, ctx: ToolContext): Promise<ToolResult> {
    // Normalize null/undefined args to empty object (LLMs often send null for no-arg tools)
    const normalizedArgs = args ?? {};

    // Validate arguments with Zod
    const parsed = this.schema.safeParse(normalizedArgs);
    if (!parsed.success) {
      this.logger.warn(`Validation failed for ${this.toolName}`, {
        args: normalizedArgs,
        error: parsed.error.issues,
      });
      return ToolResultHelpers.validationError(parsed.error);
    }

    // Execute with error handling
    try {
      const result = await this.execute(parsed.data, ctx);
      this.logger.log(`${this.toolName} executed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`${this.toolName} execution failed`, {
        args: normalizedArgs,
        error: error instanceof Error ? error.message : error,
      });
      return ToolResultHelpers.error('Something went wrong. Please try again.');
    }
  }
}

