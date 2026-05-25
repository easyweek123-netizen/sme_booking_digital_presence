import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { BookingStatusChangedEvent } from '../../bookings/events';
import { BookingStatus } from '../../bookings/entities/booking.entity';
import { CalendarService } from '../calendar.service';

@Injectable()
export class BookingSyncListener {
  constructor(private readonly calendar: CalendarService) {}

  @OnEvent(BookingStatusChangedEvent.NAME, { async: true })
  handle(event: BookingStatusChangedEvent): Promise<void> {
    if (
      event.to === BookingStatus.CONFIRMED &&
      event.from !== BookingStatus.CONFIRMED
    ) {
      return this.calendar.syncBookingConfirmed(event.bookingId);
    }
    if (
      event.to === BookingStatus.CANCELLED &&
      event.from === BookingStatus.CONFIRMED
    ) {
      return this.calendar.syncBookingCancelled(event.bookingId);
    }
    return Promise.resolve();
  }
}
