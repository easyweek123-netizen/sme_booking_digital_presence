import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Calendar, CalendarEvent, CalendarSyncLog } from './entities';
import { Business } from '../business/entities/business.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarRepository } from './repositories/calendar.repository';
import { CalendarEventRepository } from './repositories/calendar-event.repository';
import { CalendarSyncLogRepository } from './repositories/calendar-sync-log.repository';
import { GoogleOAuthService } from './google/google-oauth.service';
import { GoogleCalendarApiService } from './google/google-calendar-api.service';
import { GoogleEventFactory } from './google/google-event.factory';
import { TokenEncryptionService } from './google/token-encryption.service';
import { BookingSyncListener } from './listeners/booking-sync.listener';
import { AuthModule } from '../auth/auth.module';
import { EntitlementsModule } from '../entitlements/entitlements.module';
import calendarConfig from '../config/calendar.config';

@Module({
  imports: [
    ConfigModule.forFeature(calendarConfig),
    TypeOrmModule.forFeature([
      Calendar,
      CalendarEvent,
      CalendarSyncLog,
      Business,
      Booking,
    ]),
    AuthModule,
    EntitlementsModule,
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    CalendarRepository,
    CalendarEventRepository,
    CalendarSyncLogRepository,
    GoogleOAuthService,
    GoogleCalendarApiService,
    GoogleEventFactory,
    TokenEncryptionService,
    BookingSyncListener,
  ],
  exports: [CalendarService, TokenEncryptionService],
})
export class CalendarModule {}
