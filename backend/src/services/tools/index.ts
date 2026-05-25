/**
 * Service Tool Handlers
 *
 * Each tool is auto-discovered via @ToolHandler decorator.
 * Just add to providers in ServicesModule - no manual registration needed.
 */

export { CreateServiceTool } from './create.tool';
export { ListServicesTool } from './list.tool';
export { GetServiceTool } from './get.tool';
export { UpdateServiceTool } from './update.tool';
export { DeleteServiceTool } from './delete.tool';

import { CreateServiceTool } from './create.tool';
import { ListServicesTool } from './list.tool';
import { GetServiceTool } from './get.tool';
import { UpdateServiceTool } from './update.tool';
import { DeleteServiceTool } from './delete.tool';

export const ServiceToolHandlers = [
  CreateServiceTool,
  ListServicesTool,
  GetServiceTool,
  UpdateServiceTool,
  DeleteServiceTool,
];
