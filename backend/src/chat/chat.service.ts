import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BusinessService } from '../business/business.service';
import { ToolRegistry } from '../common/tools';
import type { Business } from '../business/entities/business.entity';
import { ChatResponseDto } from './dto/chat.dto';
import {
  ToolResultHelpers,
  type ChatAction,
  type PreviewContext,
  type ToolResult,
  type Suggestion,
  ChatCard,
  Wizard,
  ActionResult
} from '@bookeasy/shared';
import type { ToolContext } from '../common';
import { systemPrompt } from './prompts';
import {
  ChatCompletionProvider,
  type ChatToolDefinition,
  type ToolCallSummary,
} from './providers';
import { PersistentConversationMemory, type Turn as MemoryTurn } from './memory';
import type { ChatCompletionMessageParamWithSuggestions } from './memory/conversation-memory';

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

type ChatTurn = {
  memory: MemoryTurn;
  toolContext: ToolContext;
  business: Business | null;
};

@Injectable()
export class ChatService {
  private static readonly MAX_TOOL_ROUNDS = 10;
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly businessService: BusinessService,
    private readonly toolRegistry: ToolRegistry,
    private readonly completionProvider: ChatCompletionProvider,
    private readonly persistentMemory: PersistentConversationMemory,
  ) {}

  private getTools(): ChatToolDefinition[] {
    return this.toolRegistry.getToolDefinitions() as ChatToolDefinition[];
  }

  async sendMessage(
    ownerId: number,
    dto: { message: string | null; conversationId: number },
  ): Promise<ChatResponseDto> {
    const turn = await this.prepareContext(ownerId, dto.conversationId);
    const userContent = dto.message ?? '[Chat opened]';
    await turn.memory.append({ role: 'user', content: userContent } satisfies ChatCompletionMessageParamWithSuggestions);
    return this.runChatTurn(turn);
  }

  async processActionResult(
    ownerId: number,
    dto: ActionResult & { conversationId: number },
  ): Promise<ChatResponseDto> {
    const turn = await this.prepareContext(ownerId, dto.conversationId);
    await turn.memory.append({
      role: 'user', content: this.submissionMarker(dto),
    } satisfies ChatCompletionMessageParamWithSuggestions);
    return this.runChatTurn(turn);
  }
  
  private submissionMarker(dto: ActionResult): string {
    return dto.status === 'confirmed' ? `[Action confirmed] — changes applied.`
      : dto.status === 'modified' ? `[Action modified] — custom changes were applied.`
      : `[Action cancelled] — no changes were made.`;
  }

  private async prepareContext(
    ownerId: number,
    conversationId: number,
  ): Promise<ChatTurn> {
    const business = await this.businessService.findByOwnerId(ownerId);
    const appUrl = this.configService.get<string>('FRONTEND_APP_URL', 'https://');
    const baseSystemPrompt = systemPrompt(business, appUrl);

    const memory = await this.persistentMemory.begin(
      ownerId,
      conversationId,
      baseSystemPrompt,
    );

    return {
      memory,
      toolContext: { ownerId, businessId: business?.id ?? 0 } as ToolContext,
      business,
    };
  }

  private async runChatTurn(turn: ChatTurn): Promise<ChatResponseDto> {
    try {
      const first = await this.completionProvider.complete({
        messages: turn.memory.history,
        tools: this.getTools(),
        responseFormat: RESPONSE_SCHEMA,
      });
      if (first.finishReason === 'tool_calls' && first.toolCalls.length > 0) {
        return this.handleToolCalls(turn, first.toolCalls);
      }
      return this.buildResponse(turn, first.content);
    } catch (error) {
      this.logger.error('AI completion error:', error);
      return { role: 'bot', content: 'Sorry, something went wrong. Please try again.' };
    }
  }

  private async handleToolCalls(
    turn: ChatTurn,
    toolCalls: ToolCallSummary[],
  ): Promise<ChatResponseDto> {
    const allProposals: ChatAction[] = [];
    const allCards: ChatCard[] = [];
    let wizard: Wizard | undefined;
    let previewContext: PreviewContext | undefined;
    let currentToolCalls = toolCalls;

    for (let round = 0; round < ChatService.MAX_TOOL_ROUNDS; round++) {
      await turn.memory.append({
        role: 'assistant',
        content: null,
        tool_calls: currentToolCalls.map((tc) => ({
          id: tc.id,
          type: 'function' as const,
          function: tc.function,
        })),
      } satisfies ChatCompletionMessageParamWithSuggestions);

      for (const toolCall of currentToolCalls) {
        const result = await this.processToolCall(toolCall, turn.toolContext);
        await turn.memory.append({
          role: 'tool',
          tool_call_id: toolCall.id,
          content: JSON.stringify({ ...result, cards: undefined, wizard: undefined })
        } satisfies ChatCompletionMessageParamWithSuggestions);
        if (result.success) {
          if (result.proposals) allProposals.push(...result.proposals);
          if (result.previewContext) previewContext = result.previewContext;
          if (result.cards)  allCards.push(...result.cards);
          if (result.wizard) wizard = result.wizard; 
        }
      }

      try {
        const next = await this.completionProvider.complete({
          messages: turn.memory.history,
          tools: this.getTools(),
          responseFormat: RESPONSE_SCHEMA,
        });
        if (next.finishReason === 'tool_calls' && next.toolCalls.length > 0) {
          currentToolCalls = next.toolCalls;
          continue;
        }
        const response = await this.buildResponse(turn, next.content, allCards, {
          suppressSuggestions: allProposals.length > 0 || !!wizard,
        });
        response.proposals = allProposals.length > 0 ? allProposals : undefined;
        response.previewContext = previewContext;
        response.wizard = wizard;
        return response;
      } catch (error) {
        this.logger.error('AI API error (tool chain):', error);
        await turn.memory.finish();
        return {
          role: 'bot',
          content: 'I prepared that for you, but had an issue generating my response.',
          proposals: allProposals.length > 0 ? allProposals : undefined,
          previewContext,
          cards: allCards.length > 0 ? allCards : undefined,
        };
      }
    }

    this.logger.warn(`Tool loop hit ${ChatService.MAX_TOOL_ROUNDS} rounds`);
    await turn.memory.finish();
    return {
      role: 'bot',
      content: 'I gathered the information but hit a processing limit. Here is what I have so far.',
      proposals: allProposals.length > 0 ? allProposals : undefined,
      previewContext,
      cards: allCards.length > 0 ? allCards : undefined,
    };
  }

  private async buildResponse(
    turn: ChatTurn,
    rawContent: string | null,
    cards?: ChatCard[],
    options?: { suppressSuggestions?: boolean },   
  ): Promise<ChatResponseDto> {
    const outCards = cards && cards.length > 0 ? cards : undefined;
    const fallback = { content: "I'm here to help!", suggestions: null };
    let parsed: { content: string; suggestions: Suggestion[] | null };
    try {
      parsed = rawContent ? JSON.parse(rawContent) : fallback;
    } catch {
      parsed = { content: rawContent || fallback.content, suggestions: null };
    }
    const suggestions = this.normalizeSuggestions(parsed.suggestions, {
      suppress: options?.suppressSuggestions === true,
    });

    await turn.memory.append({
      role: 'assistant',
      content: parsed.content,
      suggestions,
      cards: outCards,
    });
    await turn.memory.finish();

    return { role: 'bot', content: parsed.content, suggestions, cards: outCards };
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

  private normalizeSuggestions(
    raw: Suggestion[] | null | undefined,
    options: { suppress: boolean },
  ): Suggestion[] | undefined {
    if (!raw || raw.length === 0) return undefined;
    if (options.suppress) return undefined;
  
    const seen = new Set<string>();
    const cleaned: Suggestion[] = [];
  
    for (const s of raw) {
      const label = (s.label ?? '').trim();
      const value = (s.value ?? '').trim();
      if (!label || !value) continue;
  
      const key = `${label.toLowerCase()}::${value.toLowerCase()}`;
      if (seen.has(key)) continue;
      seen.add(key);
  
      cleaned.push({
        ...s,
        label,
        value,
      });
  
      if (cleaned.length >= 3) break;
    }
  
    return cleaned.length > 0 ? cleaned : undefined;
  }
}
