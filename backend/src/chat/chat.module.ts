import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { BusinessModule } from '../business/business.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [BusinessModule, AuthModule], // AuthModule needed for OwnerResolverInterceptor
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}

