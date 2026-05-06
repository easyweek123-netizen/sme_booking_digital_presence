import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FirebaseAuthGuard } from '../../auth/guards';
import { OwnerId, OwnerResolverGuard } from '../../common';
import { Entitlement, EntitlementGuard } from '../../entitlements';
import { ConversationService } from './conversation.service';
import { ChatService } from '../chat.service';
import { ConversationDto } from '../dto/conversation.dto';
import { ChatMessageDto } from '../dto/message.dto';
import { SendMessageDto, ActionResultDto, ChatResponseDto } from '../dto/chat.dto';

@Controller('chat/conversations')
@UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
export class ConversationController {
  constructor(
    private readonly conversations: ConversationService,
    private readonly chatService: ChatService,
  ) {}

  @Get()
  async list(@OwnerId() ownerId: number): Promise<ConversationDto[]> {
    return this.conversations.list(ownerId);
  }

  @Post()
  @UseGuards(EntitlementGuard)
  @Entitlement('chat.history')
  async create(@OwnerId() ownerId: number): Promise<ConversationDto> {
    return this.conversations.create(ownerId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.conversations.remove(ownerId, id);
  }

  @Get(':id/messages')
  async findMessages(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ChatMessageDto[]> {
    return this.conversations.findMessages(ownerId, id);
  }

  @Post(':id/messages')
  async sendMessage(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SendMessageDto,
  ): Promise<ChatResponseDto> {
    return this.chatService.sendMessage(ownerId, {
      message: dto.message ?? null,
      conversationId: id,
    });
  }

  @Post(':id/actions')
  async sendActionResult(
    @OwnerId() ownerId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActionResultDto,
  ): Promise<ChatResponseDto> {
    return this.chatService.processActionResult(ownerId, {
      ...dto,
      conversationId: id,
    });
  }
}
