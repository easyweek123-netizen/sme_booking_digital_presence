import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { BusinessModule } from './business/business.module';
import { ServicesModule } from './services/services.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { BookingsModule } from './bookings/bookings.module';
import { BusinessCategoriesModule } from './business-categories/business-categories.module';
import { CustomersModule } from './customers/customers.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AdminModule } from './admin/admin.module';
import { ChatModule } from './chat/chat.module';
import { NotesModule } from './notes/notes.module';
import { databaseConfig, appConfig } from './config';

@Module({
  imports: [
    // Load configuration first
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      load: [databaseConfig, appConfig],
      envFilePath: ['.env.local', '.env'], // Load .env.local first, then .env
    }),
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    OwnerModule,
    BusinessModule,
    ServicesModule,
    ServiceCategoriesModule,
    BookingsModule,
    BusinessCategoriesModule,
    CustomersModule,
    FeedbackModule,
    AdminModule,
    ChatModule,
    NotesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
