import type { Suggestion } from '@bookeasy/shared';

export class ChatMessageDto {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
}

