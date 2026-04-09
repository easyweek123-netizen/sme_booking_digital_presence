import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { BusinessService } from '../business/business.service';
import { ToolRegistry } from '../common/tools';
import { ChatResponseDto } from './dto/chat.dto';
import { ToolResultHelpers, type ChatAction, type PreviewContext, type ToolResult } from '@bookeasy/shared';
import type { ToolContext } from '../common';
import {
  systemPrompt,
  buildWelcome,
  buildSuggestions,
} from './prompts';
import type { BusinessIdentity } from './prompts';
import type { Business } from '../business/entities/business.entity';

interface BusinessContext {
  business: Pick<Business, 'id' | 'name' | 'description'> | null;
  businessType: string | null;
}

/**
 * Chat Service
 * 
 * Orchestrates AI conversations and tool calls.
 * Uses ToolRegistry for explicitly registered tool handlers.
 */
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

    this.model = this.configService.get('AI_MODEL') || 'llama-3.3-70b-versatile';
  }

  async initChat(ownerId: number): Promise<ChatResponseDto> {
    const context = await this.buildContext(ownerId);
    const prompt = this.buildSystemPrompt(context);

    this.conversationHistory.set(ownerId, [
      { role: 'system', content: prompt },
    ]);

    const identity = this.toIdentity(context);

    return {
      role: 'bot',
      content: buildWelcome(identity.businessName),
      suggestions: buildSuggestions(identity),
    };
  }

  async sendMessage(ownerId: number, message: string): Promise<ChatResponseDto> {
    // Get or initialize conversation and business context
    const businessContext = await this.buildContext(ownerId);
    
    let history = this.conversationHistory.get(ownerId);
    if (!history) {
      history = [{ role: 'system', content: this.buildSystemPrompt(businessContext) }];
      this.conversationHistory.set(ownerId, history);
    }

    // Build tool context (pre-resolved for handlers)
    const toolContext: ToolContext = {
      ownerId,
      businessId: businessContext.business?.id ?? 0,
    };

    // Add user message
    history.push({ role: 'user', content: message });

    try {
      // Call AI with registered tools
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: history,
        tools: this.toolRegistry.getToolDefinitions(),
      });

      const choice = response.choices[0];

      // Check if AI wants to call a tool
      if (
        choice.finish_reason === 'tool_calls' &&
        choice.message.tool_calls?.length
      ) {
        const toolCalls = choice.message.tool_calls as Array<{
          id: string;
          type: string;
          function: { name: string; arguments: string };
        }>;
        return this.handleToolCalls(ownerId, toolCalls, history, toolContext);
      }

      // Normal text response
      const content = choice.message.content || "I'm here to help!";
      history.push({ role: 'assistant', content });
      this.trimHistory(ownerId, history);

      return { role: 'bot', content };
    } catch (error) {
      this.logger.error('AI API error:', error);
      return {
        role: 'bot',
        content: 'Sorry, I encountered an error. Please try again in a moment.',
      };
    }
  }

  /**
   * Process tool calls iteratively until the model returns a text response.
   * Uses a local messages array so intermediate tool-call artifacts never
   * pollute the persistent conversation history. Only the final assistant
   * text response is pushed to history.
   */
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
        });

        const choice = next.choices[0];
        if (choice.finish_reason === 'tool_calls' && choice.message.tool_calls?.length) {
          currentToolCalls = choice.message.tool_calls as typeof currentToolCalls;
          continue;
        }

        const content = choice.message.content || 'Here you go!';
        history.push({ role: 'assistant', content });
        this.trimHistory(ownerId, history);

        return {
          role: 'bot',
          content,
          proposals: allProposals.length > 0 ? allProposals : undefined,
          previewContext,
        };
      } catch (error) {
        this.logger.error('AI API error (tool chain):', error);
        return {
          role: 'bot',
          content: 'I prepared that for you, but had an issue generating my response.',
          proposals: allProposals.length > 0 ? allProposals : undefined,
          previewContext,
        };
      }
    }

    this.logger.warn(`Tool loop hit ${ChatService.MAX_TOOL_ROUNDS} rounds`);
    this.trimHistory(ownerId, history);
    return {
      role: 'bot',
      content: 'I gathered the information but hit a processing limit. Here is what I have so far.',
      proposals: allProposals.length > 0 ? allProposals : undefined,
      previewContext,
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

  /**
   * Process action result from frontend
   */
  async processActionResult(
    ownerId: number,
    result: { proposalId: string; status: string; result?: Record<string, unknown> },
  ): Promise<ChatResponseDto> {
    let history = this.conversationHistory.get(ownerId);
    
    if (!history) {
      const context = await this.buildContext(ownerId);
      history = [{ role: 'system', content: this.buildSystemPrompt(context) }];
      this.conversationHistory.set(ownerId, history);
    }

    const statusMessage = result.status === 'confirmed'
      ? `[Action confirmed: ${result.proposalId}]`
      : `[Action cancelled: ${result.proposalId}]`;
    
    history.push({ role: 'user', content: statusMessage });

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: history,
      });

      const content = response.choices[0].message.content || 
        (result.status === 'confirmed' ? 'Done! What else can I help with?' : 'No problem! What else can I help with?');
      
      history.push({ role: 'assistant', content });
      this.trimHistory(ownerId, history);

      return { role: 'bot', content };
    } catch (error) {
      this.logger.error('AI API error (action result):', error);
      return {
        role: 'bot',
        content: result.status === 'confirmed' 
          ? "There was problem processing your request. Sorry, Try Again."
          : "No problem! Let me know if you need anything else.",
      };
    }
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

  private async buildContext(ownerId: number): Promise<BusinessContext> {
    const business = await this.businessService.findByOwnerId(ownerId);

    if (!business) {
      return { business: null, businessType: null };
    }

    return {
      business: {
        id: business.id,
        name: business.name,
        description: business.description,
      },
      businessType: business.businessType?.name ?? null,
    };
  }

  private toIdentity(ctx: BusinessContext): BusinessIdentity {
    return {
      businessName: ctx.business?.name || 'Your Business',
      businessType: ctx.businessType,
      description: ctx.business?.description ?? null,
    };
  }

  private buildSystemPrompt(context: BusinessContext): string {
    return systemPrompt(this.toIdentity(context));
  }
}
