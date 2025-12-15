import { IsString, IsIn } from 'class-validator';

export class SendMessageDto {
  @IsString()
  message: string;
}

export class ChatResponseDto {
  @IsIn(['bot'])
  role: 'bot';

  @IsString()
  content: string;
}

