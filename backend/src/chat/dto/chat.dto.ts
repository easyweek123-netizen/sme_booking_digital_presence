import { IsString, IsUUID, IsEnum, IsOptional, IsObject } from 'class-validator';
import type { ChatAction, PreviewContext, ActionResultStatus } from '@bookeasy/shared';

// Re-export types from shared for convenience
export type { ChatAction, PreviewContext, ActionResult, ActionResultStatus } from '@bookeasy/shared';

export class SendMessageDto {
  @IsString()
  message: string;
}

/**
 * Chat response from API
 * 
 * Response includes:
 * - content: The AI's text response
 * - proposals: Array of action proposals for frontend to render (optional)
 * - previewContext: Which preview to show in canvas (optional)
 */
export class ChatResponseDto {
  role: 'bot';
  content: string;
  
  /** Action proposals for frontend to render in canvas */
  proposals?: ChatAction[];
  
  /** Switch preview tab to specific context */
  previewContext?: PreviewContext;
}

/**
 * DTO for action result from frontend
 * Sent after user confirms/cancels a proposal
 */
export class ActionResultDto {
  @IsUUID()
  proposalId: string;

  @IsEnum(['confirmed', 'cancelled', 'modified'] as const)
  status: ActionResultStatus;

  @IsOptional()
  @IsObject()
  result?: Record<string, unknown>;
}
