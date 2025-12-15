export interface Suggestion {
  label: string;
  value: string;
  icon?: string;
  variant?: 'default' | 'skip';
}

export interface Message {
  role: 'bot' | 'user';
  content: string;
  suggestions?: Suggestion[];
}
