import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Booking } from '../../bookings/entities/booking.entity';
import { toLocalIsoDateTime } from '../../common';
import type { GoogleEventInput } from './google-calendar-api.service';

@Injectable()
export class GoogleEventFactory {
  private readonly frontendUrl: string;

  constructor(config: ConfigService) {
    this.frontendUrl = config.get<string>('calendar.frontendUrl') || '';
  }

  create(booking: Booking): GoogleEventInput {
    const business = booking.business;
    const lines: string[] = [`Booking ${booking.reference}`];
    if (booking.customerEmail) lines.push(`Email: ${booking.customerEmail}`);
    const phone = booking.business?.phone;
    if (phone) lines.push(`Phone: ${phone}`);
    lines.push('');
    lines.push(
      `Manage in BookEasy: ${this.frontendUrl}/dashboard/bookings/${booking.id}`,
    );

    return {
      summary: `${booking.customerName} — ${booking.service?.name ?? 'Booking'}`,
      description: lines.join('\n'),
      location: business?.address ?? undefined,
      startDateTime: toLocalIsoDateTime(booking.date, booking.startTime),
      endDateTime: toLocalIsoDateTime(booking.date, booking.endTime),
      timeZone: business?.timezone ?? 'Europe/Vienna',
    };
  }
}
