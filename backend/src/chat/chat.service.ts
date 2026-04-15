import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { BusinessService } from '../business/business.service';
import { ToolRegistry } from '../common/tools';
import { ChatResponseDto, ActionResultDto } from './dto/chat.dto';
import {
  ToolResultHelpers,
  type ChatAction,
  type PreviewContext,
  type ToolResult,
  type Suggestion,
} from '@bookeasy/shared';
import type { ToolContext } from '../common';
import { systemPrompt } from './prompts';

const RESPONSE_SCHEMA = {
  type: 'json_schema' as const,
  json_schema: {
    name: 'chat_response',
    strict: true,
    schema: {
      type: 'object',
      properties: {
        content: {
          type: 'string',
          description: 'Your message to the user',
        },
        suggestions: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              label: {
                type: 'string',
                description: 'Short button label (2-5 words)',
              },
              value: {
                type: 'string',
                description: 'Message sent when user taps this',
              },
            },
            required: ['label', 'value'],
            additionalProperties: false,
          },
          description: 'Include 2-3 contextual suggestions when there is a clear next step. Omit suggestions (empty array) when the conversation is open-ended.',
        },
      },
      required: ['content', 'suggestions'],
      additionalProperties: false,
    },
  },
};
@Injectable()
export class ChatService {
  private static readonly MAX_TOOL_ROUNDS = 10;
  private readonly logger = new Logger(ChatService.name);
  private client: OpenAI;
  private model: string;
  private conversationHistory: Map<number, ChatCompletionMessageParam[]> =
    new Map();

  constructor(
    private configService: ConfigService,
    private businessService: BusinessService,
    private toolRegistry: ToolRegistry,
  ) {
    this.client = new OpenAI({
      apiKey: this.configService.get('AI_API_KEY'),
      baseURL: this.configService.get('AI_BASE_URL'),
    });

    this.model =
      this.configService.get('AI_MODEL') || 'llama-3.3-70b-versatile';
  }

  // ── Public API (thin wrappers) ───────────────────────────────────

  async initChat(ownerId: number): Promise<ChatResponseDto> {
    const { history, toolContext } = await this.prepareContext(ownerId);
    history.push({ role: 'user', content: '[Chat opened]' });
    return this.completeChat(ownerId, history, toolContext);
  }

  async sendMessage(
    ownerId: number,
    message: string,
  ): Promise<ChatResponseDto> {
    const { history, toolContext } = await this.prepareContext(ownerId);
    history.push({ role: 'user', content: message });
    return this.completeChat(ownerId, history, toolContext);
  }

  async processActionResult(
    ownerId: number,
    dto: ActionResultDto,
  ): Promise<ChatResponseDto> {
    const { history, toolContext } = await this.prepareContext(ownerId);
    history.push({
      role: 'user',
      content:
        dto.status === 'confirmed'
          ? `[Action confirmed: ${dto.proposalId}]`
          : `[Action cancelled: ${dto.proposalId}]`,
    });
    return this.completeChat(ownerId, history, toolContext);
  }

  // ── Core: context preparation ────────────────────────────────────

  private async prepareContext(ownerId: number) {
    const business = await this.businessService.findByOwnerId(ownerId);
    const appUrl = this.configService.get('FRONTEND_APP_URL', 'https://');
    const prompt = systemPrompt(business, appUrl);
    console.log('prompt', prompt);
    let history = this.conversationHistory.get(ownerId);
    if (!history) {
      history = [{ role: 'system' as const, content: prompt }];
      this.conversationHistory.set(ownerId, history);
    } else {
      history[0] = { role: 'system' as const, content: prompt };
    }

    return {
      history,
      toolContext: {
        ownerId,
        businessId: business?.id ?? 0,
      } as ToolContext,
    };
  }

  // ── Core: AI completion (tools + structured output) ──────────────

  private async completeChat(
    ownerId: number,
    history: ChatCompletionMessageParam[],
    toolContext: ToolContext,
  ): Promise<ChatResponseDto> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: history,
        tools: this.toolRegistry.getToolDefinitions(),
        response_format: RESPONSE_SCHEMA,
      });

      const choice = response.choices[0];

      if (
        choice.finish_reason === 'tool_calls' &&
        choice.message.tool_calls?.length
      ) {
        const toolCalls = choice.message.tool_calls as Array<{
          id: string;
          type: string;
          function: { name: string; arguments: string };
        }>;
        return this.handleToolCalls(
          ownerId,
          toolCalls,
          history,
          toolContext,
        );
      }
      console.log("history", JSON.stringify(history));
      return this.parseStructuredResponse(ownerId, choice.message.content, history);
    } catch (error) {
      this.logger.error('AI completion error:', error);
      return {
        role: 'bot',
        content: 'Sorry, something went wrong. Please try again.',
      };
    }
  }

  // ── Tool call loop (ReAct) ───────────────────────────────────────

  private async handleToolCalls(
    ownerId: number,
    toolCalls: Array<{
      id: string;
      type: string;
      function: { name: string; arguments: string };
    }>,
    history: ChatCompletionMessageParam[],
    toolContext: ToolContext,
  ): Promise<ChatResponseDto> {
    const allProposals: ChatAction[] = [];
    let previewContext: PreviewContext | undefined;
    let currentToolCalls = toolCalls;

    const messages: ChatCompletionMessageParam[] = [...history];

    for (let round = 0; round < ChatService.MAX_TOOL_ROUNDS; round++) {
      messages.push({
        role: 'assistant',
        content: null,
        tool_calls: currentToolCalls.map((tc) => ({
          id: tc.id,
          type: 'function' as const,
          function: tc.function,
        })),
      });

      for (const toolCall of currentToolCalls) {
        const result = await this.processToolCall(toolCall, toolContext);
        messages.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
        if (result.success) {
          if (result.proposals) allProposals.push(...result.proposals);
          if (result.previewContext) previewContext = result.previewContext;
        }
      }

      try {
        const next = await this.client.chat.completions.create({
          model: this.model,
          messages,
          tools: this.toolRegistry.getToolDefinitions(),
          response_format: RESPONSE_SCHEMA,
        });

        const choice = next.choices[0];
        if (
          choice.finish_reason === 'tool_calls' &&
          choice.message.tool_calls?.length
        ) {
          currentToolCalls = choice.message.tool_calls as typeof currentToolCalls;
          continue;
        }

        const response = this.parseStructuredResponse(
          ownerId,
          choice.message.content,
          history,
        );
        response.proposals =
          allProposals.length > 0 ? allProposals : undefined;
        response.previewContext = previewContext;
        return response;
      } catch (error) {
        this.logger.error('AI API error (tool chain):', error);
        return {
          role: 'bot',
          content:
            'I prepared that for you, but had an issue generating my response.',
          proposals: allProposals.length > 0 ? allProposals : undefined,
          previewContext,
        };
      }
    }

    this.logger.warn(`Tool loop hit ${ChatService.MAX_TOOL_ROUNDS} rounds`);
    this.trimHistory(ownerId, history);
    return {
      role: 'bot',
      content:
        'I gathered the information but hit a processing limit. Here is what I have so far.',
      proposals: allProposals.length > 0 ? allProposals : undefined,
      previewContext,
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────

  private parseStructuredResponse(
    ownerId: number,
    rawContent: string | null,
    history: ChatCompletionMessageParam[],
  ): ChatResponseDto {
    const fallback = { content: "I'm here to help!", suggestions: [] };

    let parsed: { content: string; suggestions: Suggestion[] };
    try {
      parsed = rawContent ? JSON.parse(rawContent) : fallback;
    } catch {
      parsed = { content: rawContent || fallback.content, suggestions: [] };
    }

    history.push({ role: 'assistant', content: rawContent || fallback.content });
    this.trimHistory(ownerId, history);

    return {
      role: 'bot',
      content: parsed.content,
      suggestions: parsed.suggestions,
    };
  }

  private async processToolCall(
    toolCall: { function: { name: string; arguments: string } },
    toolContext: ToolContext,
  ): Promise<ToolResult> {
    let args: Record<string, unknown>;
    try {
      args = JSON.parse(toolCall.function.arguments);
    } catch {
      this.logger.warn(
        `Malformed tool arguments for ${toolCall.function.name}: ${toolCall.function.arguments}`,
      );
      return ToolResultHelpers.error(
        `Invalid JSON in arguments for "${toolCall.function.name}". Please retry with valid JSON.`,
      );
    }

    return this.toolRegistry.process(toolCall.function.name, args, toolContext);
  }

  private trimHistory(
    ownerId: number,
    history: ChatCompletionMessageParam[],
  ): void {
    if (history.length > 30) {
      const system = history[0];
      const trimmed = [system, ...history.slice(-29)];
      this.conversationHistory.set(ownerId, trimmed);
    }
  }
}
