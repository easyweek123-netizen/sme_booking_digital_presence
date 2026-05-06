export class ConversationDto {
  id: number;
  title: string;
  lastMessageAt: string | null;
  createdAt: string;
}

export class ConversationMessageDto {
  role: 'bot' | 'user';
  content: string;
}
