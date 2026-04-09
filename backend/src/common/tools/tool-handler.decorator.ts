import 'reflect-metadata';

/**
 * Options for the @ToolHandler decorator.
 * Parameters are auto-generated from the Zod schema in BaseToolHandler.
 */
export interface ToolHandlerOptions {
  /** Tool name (e.g., 'services_create') */
  name: string;
  /** Description shown to AI */
  description: string;
}

const TOOL_HANDLER_METADATA = 'tool:handler';
const TOOL_OPTIONS_METADATA = 'tool:options';

/**
 * Decorator to mark a class as a tool handler.
 * The decorator stores metadata that is used by ToolDiscoveryService
 * to auto-register handlers.
 * 
 * @example
 * ```typescript
 * @ToolHandler({
 *   name: 'services_create',
 *   description: 'Create a new service',
 *   parameters: {
 *     type: 'object',
 *     properties: { name: { type: 'string' } },
 *     required: ['name'],
 *   },
 * })
 * @Injectable()
 * export class CreateServiceTool extends BaseToolHandler<Args> { ... }
 * ```
 */
export function ToolHandler(options: ToolHandlerOptions): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(TOOL_HANDLER_METADATA, true, target);
    Reflect.defineMetadata(TOOL_OPTIONS_METADATA, options, target);
  };
}

/**
 * Check if a class is decorated with @ToolHandler
 */
export function isToolHandler(target: object): boolean {
  return Reflect.getMetadata(TOOL_HANDLER_METADATA, target) === true;
}

/**
 * Get the tool options from a decorated class
 */
export function getToolOptions(target: object): ToolHandlerOptions | undefined {
  return Reflect.getMetadata(TOOL_OPTIONS_METADATA, target);
}

