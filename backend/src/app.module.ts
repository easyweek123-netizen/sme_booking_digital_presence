import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { FirebaseModule } from './firebase/firebase.module';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { BusinessModule } from './business/business.module';
import { ScheduleModule } from './schedule/schedule.module';
import { ServicesModule } from './services/services.module';
import { ServiceCategoriesModule } from './service-categories/service-categories.module';
import { BookingsModule } from './bookings/bookings.module';
import { BusinessCategoriesModule } from './business-categories/business-categories.module';
import { CustomersModule } from './customers/customers.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AdminModule } from './admin/admin.module';
import { ChatModule } from './chat/chat.module';
import { NotesModule } from './notes/notes.module';
import { InquiriesModule } from './inquiries/inquiries.module';
import { LocationsModule } from './locations/locations.module';
import { BillingModule } from './billing/billing.module';
import { CalendarModule } from './calendar/calendar.module';
import { EntitlementsModule } from './entitlements/entitlements.module';
import { TimeModule } from './common/time/time.module';
import { databaseConfig, appConfig } from './config';
import calendarConfig from './config/calendar.config';

@Module({
  imports: [
    // Load configuration first
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      load: [databaseConfig, appConfig, calendarConfig],
      envFilePath: ['.env.local', '.env'], // Load .env.local first, then .env
    }),
    EventEmitterModule.forRoot(),
    TimeModule,
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 30 }]),
    DatabaseModule,
    FirebaseModule,
    AuthModule,
    OwnerModule,
    BusinessModule,
    ScheduleModule,
    ServicesModule,
    ServiceCategoriesModule,
    BookingsModule,
    BusinessCategoriesModule,
    CustomersModule,
    FeedbackModule,
    AdminModule,
    CalendarModule,
    ChatModule,
    NotesModule,
    InquiriesModule,
    LocationsModule,
    BillingModule,
    EntitlementsModule,
  ],
  controllers: [AppController],
  providers: [
    // Global rate-limiting — @Throttle({...}) on individual routes overrides the default.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
