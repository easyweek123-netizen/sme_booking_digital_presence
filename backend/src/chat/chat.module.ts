import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { BusinessModule } from '../business/business.module';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { ToolRegistry } from './tool.registry';

@Module({
  imports: [
    BusinessModule,
    AuthModule,
    ServicesModule, // For ServiceToolHandler
  ],
  controllers: [ChatController],
  providers: [ChatService, ToolRegistry],
})
export class ChatModule {}
