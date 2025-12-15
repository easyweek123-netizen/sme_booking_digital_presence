import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { BusinessService } from '../business/business.service';
import { ChatResponseDto } from './dto/chat.dto';
import type { Business } from '../business/entities/business.entity';
import type { Service } from '../services/entities/service.entity';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Pick only fields AI needs from Business entity
type AIBusinessFields = Pick<Business, 'name' | 'description'>;

// Pick only fields AI needs from Service entity
type AIServiceFields = Pick<Service, 'name' | 'price' | 'durationMinutes'>;

interface BusinessContext {
  business: AIBusinessFields | null;
  services: AIServiceFields[];
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private client: OpenAI;
  private model: string;
  private conversationHistory: Map<number, ChatMessage[]> = new Map();

  constructor(
    private configService: ConfigService,
    private businessService: BusinessService,
  ) {
    // All AI config from environment
    this.client = new OpenAI({
      apiKey: this.configService.get('AI_API_KEY'),
      baseURL: this.configService.get('AI_BASE_URL'),
    });

    this.model = this.configService.get('AI_MODEL') || 'llama-3.3-70b-versatile';
  }

  async initChat(ownerId: number): Promise<ChatResponseDto> {
    const context = await this.buildContext(ownerId);
    const systemPrompt = this.buildSystemPrompt(context);

    // Initialize conversation
    this.conversationHistory.set(ownerId, [
      { role: 'system', content: systemPrompt },
    ]);

    // Generate welcome message
    const businessName = context.business?.name || 'Your Business';
    const servicesCount = context.services.length;

    const welcomeContent =
      servicesCount === 0
        ? `Hey! I'm your ${businessName} assistant. Let's get you set up! Would you like to add your first service?`
        : `Hey! I'm your ${businessName} assistant. You have ${servicesCount} service${servicesCount > 1 ? 's' : ''}. How can I help?`;

    return {
      role: 'bot',
      content: welcomeContent,
    };
  }

  async sendMessage(ownerId: number, message: string): Promise<ChatResponseDto> {
    // Get or initialize conversation
    let history = this.conversationHistory.get(ownerId);
    if (!history) {
      const context = await this.buildContext(ownerId);
      history = [{ role: 'system', content: this.buildSystemPrompt(context) }];
      this.conversationHistory.set(ownerId, history);
    }

    // Add user message
    history.push({ role: 'user', content: message });

    try {
      // Call AI (works with both Groq and OpenAI)
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: history,
      });

      const assistantMessage =
        response.choices[0].message.content || "I'm here to help!";

      // Add assistant message to history
      history.push({ role: 'assistant', content: assistantMessage });

      // Keep history manageable (last 20 messages + system)
      if (history.length > 21) {
        const system = history[0];
        history = [system, ...history.slice(-20)];
        this.conversationHistory.set(ownerId, history);
      }

      return {
        role: 'bot',
        content: assistantMessage,
      };
    } catch (error) {
      this.logger.error('AI API error:', error);
      return {
        role: 'bot',
        content:
          'Sorry, I encountered an error. Please try again in a moment.',
      };
    }
  }

  private async buildContext(ownerId: number): Promise<BusinessContext> {
    const business = await this.businessService.findByOwnerId(ownerId);

    if (!business) {
      return {
        business: null,
        services: [],
      };
    }

    // Pick only the fields AI needs
    return {
      business: {
        name: business.name,
        description: business.description,
      },
      services:
        business.services?.map((s) => ({
          name: s.name,
          price: s.price,
          durationMinutes: s.durationMinutes,
        })) || [],
    };
  }

  private buildSystemPrompt(context: BusinessContext): string {
    const businessName = context.business?.name || 'Your Business';
    const description = context.business?.description || 'Not set';
    const servicesCount = context.services.length;
    const servicesList =
      context.services.map((s) => `${s.name} - $${s.price}`).join(', ') ||
      'None yet';

    return `You are the AI assistant for "${businessName}" on BookEasy, a booking platform for small businesses.

BUSINESS INFO:
- Name: ${businessName}
- Description: ${description}
- Services: ${servicesCount} (${servicesList})

YOUR ROLE:
- Help the business owner set up their booking page
- Answer questions about how BookEasy works
- Guide them to add services, update their profile, and manage bookings
- Be concise, friendly, and helpful

IMPORTANT:
- You cannot directly make changes to their account yet
- For now, guide them to use the dashboard menu for actions
- If they want to add a service, tell them to click "Services" in the menu

Keep responses short and actionable.`;
  }
}
