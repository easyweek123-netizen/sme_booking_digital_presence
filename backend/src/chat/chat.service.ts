import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { BusinessService } from '../business/business.service';
import { ToolRegistry } from '../common/tools';
import type { Business } from '../business/entities/business.entity';
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
import {
  ChatCompletionProvider,
  type ChatToolDefinition,
  type ToolCallSummary,
} from './providers';
import { ConversationStore } from './history';
import {
  buildToolTraceAssistantContent,
  formatToolTraceLine,
} from '../common/tools';

// ── Response schema ─────────────────────────────────────────────────

const SUGGESTION_ITEM_SCHEMA = {
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
} as const;

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
          description:
            'Your message to the user. Never claim data is saved or live unless the user message is [Action confirmed: ...] or you are directing them to confirm in the Actions panel.',
        },
        suggestions: {
          description:
            'Quick-reply chips. Use null when the next step is the Actions panel (e.g. after creating proposals) or when chips would not be helpful.',
          anyOf: [
            { type: 'array', items: SUGGESTION_ITEM_SCHEMA },
            { type: 'null' },
          ],
        },
      },
      required: ['content', 'suggestions'],
      additionalProperties: false,
    },
  },
} as const;

// ── Service ─────────────────────────────────────────────────────────

@Injectable()
export class ChatService {
  private static readonly MAX_TOOL_ROUNDS = 10;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly businessService: BusinessService,
    private readonly toolRegistry: ToolRegistry,
    private readonly completionProvider: ChatCompletionProvider,
    private readonly conversationStore: ConversationStore,
  ) {}

  /**
   * Resolved at request time because ToolDiscoveryService.onModuleInit
   * registers handlers after all constructors have run.
   */
  private getTools(): ChatToolDefinition[] {
    return this.toolRegistry.getToolDefinitions() as ChatToolDefinition[];
  }

  async sendMessage(
    ownerId: number,
    message: string,
  ): Promise<ChatResponseDto> {
    const { history, toolContext } = await this.prepareContext(ownerId);
    history.push({ role: 'user', content: message });
    return this.runChatTurn(ownerId, history, toolContext);
  }

  async processActionResult(
    ownerId: number,
    dto: ActionResultDto,
  ): Promise<ChatResponseDto> {
    const { history, toolContext } = await this.prepareContext(ownerId);

    const feedbackContent =
      dto.status === 'confirmed'
        ? this.buildConfirmedFeedback(dto)
        : `[Action cancelled: ${dto.proposalId}] — no changes were made.`;

    history.push({ role: 'user', content: feedbackContent });
    return this.runChatTurn(ownerId, history, toolContext);
  }

  // ── Context preparation (single DB query) ─────────────────────────

  private async prepareContext(ownerId: number): Promise<{
    history: ChatCompletionMessageParam[];
    toolContext: ToolContext;
    business: Business | null;
  }> {
    const business = await this.businessService.findByOwnerId(ownerId);
    const appUrl = this.configService.get<string>(
      'FRONTEND_APP_URL',
      'https://',
    );
    const prompt = systemPrompt(business, appUrl);

    const history = this.conversationStore.ensure(ownerId, {
      role: 'system',
      content: prompt,
    });

    return {
      history,
      toolContext: {
        ownerId,
        businessId: business?.id ?? 0,
      } as ToolContext,
      business,
    };
  }

  // ── Core turn: first completion → optional tool loop → response ───

  private async runChatTurn(
    ownerId: number,
    history: ChatCompletionMessageParam[],
    toolContext: ToolContext,
  ): Promise<ChatResponseDto> {
    try {
      const first = await this.completionProvider.complete({
        messages: history,
        tools: this.getTools(),
        responseFormat: RESPONSE_SCHEMA,
      });

      if (first.finishReason === 'tool_calls' && first.toolCalls.length > 0) {
        return this.handleToolCalls(
          ownerId,
          first.toolCalls,
          history,
          toolContext,
        );
      }

      return this.buildResponse(ownerId, first.content, history);
    } catch (error) {
      this.logger.error('AI completion error:', error);
      return {
        role: 'bot',
        content: 'Sorry, something went wrong. Please try again.',
      };
    }
  }

  // ── Tool call loop ────────────────────────────────────────────────

  private async handleToolCalls(
    ownerId: number,
    toolCalls: ToolCallSummary[],
    history: ChatCompletionMessageParam[],
    toolContext: ToolContext,
  ): Promise<ChatResponseDto> {
    const allProposals: ChatAction[] = [];
    let previewContext: PreviewContext | undefined;
    let currentToolCalls = toolCalls;

    // Working copy for the multi-turn messages sent to the LLM.
    // `history` is the persisted array; we only append trace + final to it.
    // const messages: ChatCompletionMessageParam[] = [...history];
    const toolTraceLines: string[] = [];

    for (let round = 0; round < ChatService.MAX_TOOL_ROUNDS; round++) {
      history.push({
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
        history.push({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
        // toolTraceLines.push(
        //   formatToolTraceLine(toolCall.function.name, result),
        // );
        if (result.success) {
          if (result.proposals) allProposals.push(...result.proposals);
          if (result.previewContext) previewContext = result.previewContext;
        }
      }

      try {
        const next = await this.completionProvider.complete({
          messages: history,
          tools: this.getTools(),
          responseFormat: RESPONSE_SCHEMA,
        });

        if (next.finishReason === 'tool_calls' && next.toolCalls.length > 0) {
          currentToolCalls = next.toolCalls;
          continue;
        }

        // Persist tool trace to history once
        this.appendToolTrace(history, toolTraceLines);

        const response = await this.buildResponse(
          ownerId,
          next.content,
          history,
        );
        response.proposals =
          allProposals.length > 0 ? allProposals : undefined;
        response.previewContext = previewContext;
        return response;
      } catch (error) {
        this.logger.error('AI API error (tool chain):', error);
        await this.conversationStore.trimWithSummaryIfNeeded(ownerId);
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
    await this.conversationStore.trimWithSummaryIfNeeded(ownerId);
    return {
      role: 'bot',
      content:
        'I gathered the information but hit a processing limit. Here is what I have so far.',
      proposals: allProposals.length > 0 ? allProposals : undefined,
      previewContext,
    };
  }

  // ── Helpers ───────────────────────────────────────────────────────

  private appendToolTrace(
    history: ChatCompletionMessageParam[],
    lines: string[],
  ): void {
    if (lines.length === 0) return;
    history.push({
      role: 'assistant',
      content: buildToolTraceAssistantContent(lines),
    });
  }

  private async buildResponse(
    ownerId: number,
    rawContent: string | null,
    history: ChatCompletionMessageParam[],
  ): Promise<ChatResponseDto> {
    const fallback = { content: "I'm here to help!", suggestions: null };

    let parsed: { content: string; suggestions: Suggestion[] | null };
    try {
      parsed = rawContent ? JSON.parse(rawContent) : fallback;
    } catch {
      parsed = { content: rawContent || fallback.content, suggestions: null };
    }

    const suggestions =
      parsed.suggestions == null || parsed.suggestions.length === 0
        ? undefined
        : parsed.suggestions;

    history.push({ role: 'assistant', content: parsed.content });
    await this.conversationStore.trimWithSummaryIfNeeded(ownerId);

    return {
      role: 'bot',
      content: parsed.content,
      suggestions,
    };
  }

  private buildConfirmedFeedback(dto: ActionResultDto): string {
    const fields =
      dto.result && Object.keys(dto.result).length > 0
        ? Object.keys(dto.result).join(', ')
        : 'see proposal type';
    return `[Action confirmed: ${dto.proposalId}] — applied fields: ${fields}. Database is now updated.`;
  }

  private async processToolCall(
    toolCall: ToolCallSummary,
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
}
