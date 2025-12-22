/**
 * Service Tool Handlers
 * 
 * Each tool is auto-discovered via @ToolHandler decorator.
 * Just add to providers in ServicesModule - no manual registration needed.
 */

import { CreateServiceTool } from './create.tool';
import { ListServicesTool } from './list.tool';
import { UpdateServiceTool } from './update.tool';
import { DeleteServiceTool } from './delete.tool';

export { CreateServiceTool } from './create.tool';
export { ListServicesTool } from './list.tool';
export { UpdateServiceTool } from './update.tool';
export { DeleteServiceTool } from './delete.tool';

/** All service tool handlers for module registration */
export const ServiceToolHandlers = [
  CreateServiceTool,
  ListServicesTool,
  UpdateServiceTool,
  DeleteServiceTool,
];
