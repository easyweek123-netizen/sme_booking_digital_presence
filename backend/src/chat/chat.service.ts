import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';
import { BusinessService } from '../business/business.service';
import { ToolRegistry } from '../common/tools';
import { ChatResponseDto } from './dto/chat.dto';
import type { ChatAction, PreviewContext } from '@bookeasy/shared';
import type { ToolContext } from '../common';
import {
  welcomeNewUser,
  welcomeReturningUser,
  systemPrompt,
  setupGuidanceNewUser,
  setupGuidanceNoDescription,
} from './prompts';
import type { Business } from '../business/entities/business.entity';
import type { Service } from '../services/entities/service.entity';

// Pick only fields AI needs
type AIBusinessFields = Pick<Business, 'name' | 'description' | 'id'>;
type AIServiceFields = Pick<Service, 'id' | 'name' | 'price' | 'durationMinutes' | 'imageUrl'>;

interface BusinessContext {
  business: AIBusinessFields | null;
  services: AIServiceFields[];
}

/**
 * Chat Service
 * 
 * Orchestrates AI conversations and tool calls.
 * Uses ToolRegistry for explicitly registered tool handlers.
 */
@Injectable()
export class ChatService {
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

    // Initialize conversation
    this.conversationHistory.set(ownerId, [
      { role: 'system', content: prompt },
    ]);

    // Generate welcome message
    const businessName = context.business?.name || 'Your Business';
    const servicesCount = context.services.length;
    const welcomeContent =
      servicesCount === 0
        ? welcomeNewUser(businessName)
        : welcomeReturningUser(businessName, servicesCount);

    return {
      role: 'bot',
      content: welcomeContent,
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
   * Handle tool calls from AI
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
    // Add assistant message with tool calls to history
    history.push({
      role: 'assistant',
      content: null,
      tool_calls: toolCalls.map((tc) => ({
        id: tc.id,
        type: 'function' as const,
        function: tc.function,
      })),
    });

    // Collect proposals and previewContext from all tool results
    const allProposals: ChatAction[] = [];
    let previewContext: PreviewContext | undefined;

    // Process each tool call via discovery service
    for (const toolCall of toolCalls) {
      let args: Record<string, unknown>;
      try {
        args = JSON.parse(toolCall.function.arguments);
      } catch {
        this.logger.warn(`Invalid tool arguments: ${toolCall.function.arguments}`);
        continue;
      }

      const result = await this.toolRegistry.process(
        toolCall.function.name,
        args,
        toolContext,
      );

      // Add tool result to history
      history.push({
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });

      // Collect proposals from tool handler
      if (result.success) {
        if (result.proposals) {
          allProposals.push(...result.proposals);
        }
        if (result.previewContext) {
          previewContext = result.previewContext;
        }
      }
    }

    // Call AI again for final response
    try {
      const finalResponse = await this.client.chat.completions.create({
        model: this.model,
        messages: history,
      });

      const content =
        finalResponse.choices[0].message.content || 'Here you go!';
      history.push({ role: 'assistant', content });
      this.trimHistory(ownerId, history);

      return {
        role: 'bot',
        content,
        proposals: allProposals.length > 0 ? allProposals : undefined,
        previewContext,
      };
    } catch (error) {
      this.logger.error('AI API error (final response):', error);
      return {
        role: 'bot',
        content: 'I prepared that for you, but had an issue generating my response.',
        proposals: allProposals.length > 0 ? allProposals : undefined,
        previewContext,
      };
    }
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
      return { business: null, services: [] };
    }

    return {
      business: {
        id: business.id,
        name: business.name,
        description: business.description,
      },
      services:
        business.services?.map((s) => ({
          id: s.id,
          name: s.name,
          price: s.price,
          durationMinutes: s.durationMinutes,
          imageUrl: s.imageUrl
        })) || [],
    };
  }

  private buildSystemPrompt(context: BusinessContext): string {
    const businessName = context.business?.name || 'Your Business';
    const description = context.business?.description || 'Not set yet';
    const servicesCount = context.services.length;
    const servicesList = context.services
      .map((s) => `${s.name} - $${s.price} - ${s.id}`)
      .join(', ');
    const servicesInfo =
      servicesCount === 0
        ? 'None yet - help them add one!'
        : `${servicesCount} (${servicesList})`;

    let guidance = '';
    if (servicesCount === 0) {
      guidance = setupGuidanceNewUser();
    } else if (!context.business?.description) {
      guidance = setupGuidanceNoDescription(servicesCount);
    }

    return systemPrompt(businessName, description, servicesInfo, guidance);
  }
}
