export {
  ToolHandler,
  isToolHandler,
  getToolOptions,
} from './tool-handler.decorator';
export type { ToolHandlerOptions } from './tool-handler.decorator';
export { BaseToolHandler } from './base-tool.handler';
export { ToolRegistry } from './tool-registry';
export { ToolsModule, TOOL_HANDLERS } from './tools.module';
export { ToolDiscoveryService } from './tool-discovery.service';
export { zodToOpenAISchema } from './schema-utils';
export type { OpenAIParameters } from './schema-utils';
export { buildProposalToolMessage } from './proposal-tool-message';
export {
  TOOL_TRACE_PREFIX,
  formatToolTraceLine,
  buildToolTraceAssistantContent,
} from './tool-trace';
