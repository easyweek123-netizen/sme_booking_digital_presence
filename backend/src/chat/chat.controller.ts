import { Controller, Post, Get, Body, UseGuards, UseInterceptors } from '@nestjs/common';
import { FirebaseAuthGuard } from '../auth/guards/firebase-auth.guard';
import { OwnerResolverInterceptor, OwnerId } from '../common';
import { ChatService } from './chat.service';
import { SendMessageDto, ActionResultDto, ChatResponseDto } from './dto/chat.dto';

@Controller('chat')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(OwnerResolverInterceptor)
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('init')
  async initChat(@OwnerId() ownerId: number): Promise<ChatResponseDto> {
    return this.chatService.initChat(ownerId);
  }

  @Post()
  async sendMessage(
    @OwnerId() ownerId: number,
    @Body() dto: SendMessageDto,
  ): Promise<ChatResponseDto> {
    return this.chatService.sendMessage(ownerId, dto.message);
  }

  /**
   * Handle action result from frontend
   * Called after user confirms/cancels a proposal
   * Returns AI follow-up response
   */
  @Post('action-result')
  async handleActionResult(
    @OwnerId() ownerId: number,
    @Body() dto: ActionResultDto,
  ): Promise<ChatResponseDto> {
    return this.chatService.processActionResult(ownerId, dto);
  }
}
