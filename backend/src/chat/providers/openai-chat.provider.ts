import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import {
  ChatCompletionProvider,
  type CompletionRequest,
  type CompletionResult,
  type ToolCallSummary,
} from './chat-completion.provider';

@Injectable()
export class OpenAIChatProvider extends ChatCompletionProvider {
  private readonly client: OpenAI;
  private readonly model: string;
  private readonly temperature: number;

  constructor(private readonly configService: ConfigService) {
    super();
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('AI_API_KEY'),
      baseURL: this.configService.get<string>('AI_BASE_URL'),
    });
    this.model =
      this.configService.get<string>('AI_MODEL') || 'llama-3.3-70b-versatile';
    this.temperature = parseFloat(
      this.configService.get<string>('AI_TEMPERATURE') ?? '0.2',
    );
  }

  async complete(request: CompletionRequest): Promise<CompletionResult> {
    const body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming =
      {
        model: this.model,
        temperature: this.temperature,
        messages: request.messages,
      };

    if (request.tools?.length) {
      body.tools = request.tools;
    }
    if (request.responseFormat) {
      body.response_format = request.responseFormat;
    }

    const response = await this.client.chat.completions.create(body);
    const choice = response.choices[0];

    const toolCalls: ToolCallSummary[] = (choice.message.tool_calls ?? [])
      .filter((tc) => tc.type === 'function')
      .map((tc) => {
        const fn = (tc as { id: string; function: { name: string; arguments: string } }).function;
        return {
          id: tc.id,
          function: { name: fn.name, arguments: fn.arguments ?? '' },
        };
      });

    return {
      finishReason:
        choice.finish_reason === 'tool_calls' ? 'tool_calls' : 'stop',
      content: choice.message.content,
      toolCalls,
    };
  }
}
