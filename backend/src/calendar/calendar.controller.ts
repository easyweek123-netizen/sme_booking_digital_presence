import { Controller, Get, Post, Query, Res, UseGuards, HttpCode, HttpStatus, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { FirebaseAuthGuard } from '../auth/guards';
import { OwnerId, OwnerResolverGuard } from '../common';
import { Entitlement, EntitlementGuard } from '../entitlements';
import { CalendarService } from './calendar.service';
import { CalendarStatusDto } from './dto/calendar-status.dto';
import { CalendarSyncLogDto } from './dto/calendar-sync-log.dto';

@Controller('calendar')
export class CalendarController {
  private readonly logger = new Logger(CalendarController.name);

  constructor(private readonly calendar: CalendarService) {}

  @Get('status')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  status(@OwnerId() ownerId: number): Promise<CalendarStatusDto> {
    return this.calendar.getStatus(ownerId);
  }

  @Get('sync-log')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard)
  syncLog(
    @OwnerId() ownerId: number,
    @Query('limit') limit?: string,
  ): Promise<CalendarSyncLogDto[]> {
    const parsed = Number.parseInt(limit ?? '10', 10);
    const safe =
      Number.isFinite(parsed) && parsed > 0 ? Math.min(parsed, 50) : 10;
    return this.calendar.listSyncLog(ownerId, safe);
  }

  @Get('google/auth-url')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, EntitlementGuard)
  @Entitlement('calendar.sync')
  authUrl(@OwnerId() ownerId: number): { authUrl: string } {
    return { authUrl: this.calendar.buildGoogleAuthUrl(ownerId) };
  }

  @Get('google/callback')
  async callback(
    @Query('code') code: string | undefined,
    @Query('state') state: string | undefined,
    @Query('error') error: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    if (error)
      return res.redirect(this.calendar.redirectAfterCallback('error', error));
    if (!code || !state)
      return res.redirect(
        this.calendar.redirectAfterCallback('error', 'missing_params'),
      );
    try {
      await this.calendar.handleGoogleCallback(code, state);
      return res.redirect(this.calendar.redirectAfterCallback('success'));
    } catch (e) {
      this.logger.error(
        'Google OAuth callback failed',
        e instanceof Error ? e.stack : String(e),
      );
      const reason = e instanceof Error ? e.message : 'callback_failed';
      return res.redirect(this.calendar.redirectAfterCallback('error', reason));
    }
  }

  @Post('google/disconnect')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, EntitlementGuard)
  @Entitlement('calendar.sync')
  @HttpCode(HttpStatus.NO_CONTENT)
  disconnect(@OwnerId() ownerId: number): Promise<void> {
    return this.calendar.disconnectGoogle(ownerId);
  }
}
