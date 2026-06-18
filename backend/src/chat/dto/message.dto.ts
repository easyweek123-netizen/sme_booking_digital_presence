import type { Suggestion, ChatCard } from '@bookeasy/shared';

export class ChatMessageDto {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
  cards?: ChatCard[];
}

