import { ListCustomersTool } from './list.tool';
import { GetCustomerTool } from './get.tool';

export { ListCustomersTool } from './list.tool';
export { GetCustomerTool } from './get.tool';

/** All customer tool handlers for module registration */
export const CustomerToolHandlers = [ListCustomersTool, GetCustomerTool];
