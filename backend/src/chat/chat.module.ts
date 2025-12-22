import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { BusinessModule } from '../business/business.module';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { ToolsModule } from '../common/tools';

/**
 * Chat Module
 *
 * Tool handlers are auto-discovered from entity modules (ServicesModule, etc.)
 * No need to import them here - just import ToolsModule.
 */
@Module({
  imports: [
    BusinessModule,
    AuthModule,
    ServicesModule, // Tool handlers defined here are auto-discovered
    ToolsModule, // Auto-discovers all @ToolHandler decorated classes
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
