import { IsUUID } from 'class-validator';

export class ConfirmIntentDto {
  @IsUUID()
  sessionId: string;
}
