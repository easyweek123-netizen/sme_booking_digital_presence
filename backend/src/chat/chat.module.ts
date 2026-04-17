import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { BusinessModule } from '../business/business.module';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { BookingsModule } from '../bookings/bookings.module';
import { CustomersModule } from '../customers/customers.module';
import { NotesModule } from '../notes/notes.module';
import { ToolsModule } from '../common/tools';
import { ChatCompletionProvider, OpenAIChatProvider } from './providers';
import { ConversationStore } from './history';

@Module({
  imports: [
    BusinessModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    CustomersModule,
    NotesModule,
    ToolsModule,
  ],
  controllers: [ChatController],
  providers: [
    OpenAIChatProvider,
    {
      provide: ChatCompletionProvider,
      useExisting: OpenAIChatProvider,
    },
    ConversationStore,
    ChatService,
  ],
})
export class ChatModule {}
