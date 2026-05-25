import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Calendar, CalendarEvent, CalendarSyncLog } from './entities';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { CalendarRepository } from './repositories/calendar.repository';
import { CalendarEventRepository } from './repositories/calendar-event.repository';
import { CalendarSyncLogRepository } from './repositories/calendar-sync-log.repository';
import { GoogleOAuthService } from './google/google-oauth.service';
import { GoogleCalendarApiService } from './google/google-calendar-api.service';
import { TokenEncryptionService } from './google/token-encryption.service';
import { AuthModule } from '../auth/auth.module';
import { EntitlementsModule } from '../entitlements/entitlements.module';
import { BusinessModule } from '../business/business.module';
import calendarConfig from '../config/calendar.config';

@Module({
  imports: [
    ConfigModule.forFeature(calendarConfig),
    TypeOrmModule.forFeature([Calendar, CalendarEvent, CalendarSyncLog]),
    AuthModule,
    EntitlementsModule,
    BusinessModule,
  ],
  controllers: [CalendarController],
  providers: [
    CalendarService,
    CalendarRepository,
    CalendarEventRepository,
    CalendarSyncLogRepository,
    GoogleOAuthService,
    GoogleCalendarApiService,
    TokenEncryptionService,
  ],
  exports: [CalendarService, TokenEncryptionService],
})
export class CalendarModule {}
