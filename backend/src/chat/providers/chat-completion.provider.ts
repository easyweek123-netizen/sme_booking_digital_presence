import type {
  ChatCompletionCreateParams,
  ChatCompletionMessageParam,
} from 'openai/resources/chat/completions';

export type ChatToolDefinition = NonNullable<
  ChatCompletionCreateParams['tools']
>[number];

export type ChatResponseFormat = ChatCompletionCreateParams['response_format'];

export interface CompletionRequest {
  messages: ChatCompletionMessageParam[];
  tools?: ChatToolDefinition[];
  responseFormat?: ChatResponseFormat;
}

export interface ToolCallSummary {
  id: string;
  function: { name: string; arguments: string };
}

export interface CompletionResult {
  finishReason: 'stop' | 'tool_calls';
  content: string | null;
  toolCalls: ToolCallSummary[];
}

export abstract class ChatCompletionProvider {
  abstract complete(request: CompletionRequest): Promise<CompletionResult>;
}
