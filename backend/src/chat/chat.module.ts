import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from './chat.service';
import { BusinessModule } from '../business/business.module';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from '../services/services.module';
import { BookingsModule } from '../bookings/bookings.module';
import { CustomersModule } from '../customers/customers.module';
import { NotesModule } from '../notes/notes.module';
import { BillingModule } from '../billing/billing.module';
import { ToolsModule } from '../common/tools';
import { ChatCompletionProvider, OpenAIChatProvider } from './providers';
import { Conversation, Message } from './entities';
import { ConversationService } from './conversations/conversation.service';
import { ConversationController } from './conversations/conversation.controller';
import { MessageRepository } from './repositories/message.repository';
import { PersistentConversationMemory } from './memory';
import { ConversationCounter } from './conversations/conversation.counter';
import { COUNTER_TOKEN } from '../entitlements/counters/usage-counter.registry';
import { CounterKey } from '../entitlements/config/counter-keys';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    BusinessModule,
    AuthModule,
    ServicesModule,
    BookingsModule,
    CustomersModule,
    NotesModule,
    BillingModule,
    ToolsModule,
  ],
  controllers: [ConversationController],
  providers: [
    OpenAIChatProvider,
    {
      provide: ChatCompletionProvider,
      useExisting: OpenAIChatProvider,
    },

    MessageRepository,
    PersistentConversationMemory,

    ConversationCounter,
    {
      provide: COUNTER_TOKEN(CounterKey.ChatThreads),
      useExisting: ConversationCounter,
    },

    ConversationService,
    ChatService,
  ],
})
export class ChatModule {}
