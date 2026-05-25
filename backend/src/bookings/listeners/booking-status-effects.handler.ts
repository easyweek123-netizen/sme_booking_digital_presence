import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookingCreatedEvent, BookingStatusChangedEvent } from '../events';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { Business } from '../../business/entities/business.entity';
import { CalendarService } from '../../calendar/calendar.service';
import { EmailService } from '../../email/email.service';

@Injectable()
export class BookingStatusEffectsHandler {
  private readonly logger = new Logger(BookingStatusEffectsHandler.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookings: Repository<Booking>,
    @InjectRepository(Business)
    private readonly businesses: Repository<Business>,
    private readonly calendar: CalendarService,
    private readonly email: EmailService,
  ) {}

  @OnEvent(BookingStatusChangedEvent.NAME, { async: true })
  async handle(event: BookingStatusChangedEvent): Promise<void> {
    const booking = await this.bookings.findOne({
      where: { id: event.bookingId },
      relations: ['service', 'service.business', 'customer'],
    });
    if (!booking) return;

    const business = await this.businesses.findOne({
      where: { id: booking.service.businessId },
    });
    if (!business) return;

    const confirmed =
      event.to === BookingStatus.CONFIRMED &&
      event.from !== BookingStatus.CONFIRMED;
    const cancelled =
      event.to === BookingStatus.CANCELLED &&
      event.from === BookingStatus.CONFIRMED;

    let meetLink: string | undefined;

    if (confirmed) {
      meetLink = (await this.syncCalendarOnConfirm(booking)) ?? undefined;
    } else if (cancelled) {
      await this.syncCalendarOnCancel(booking);
    }

    await this.sendEmail(booking, business, event.to, meetLink);
  }

  @OnEvent(BookingCreatedEvent.NAME, { async: true })
  async handleCreated(event: BookingCreatedEvent): Promise<void> {
    const booking = await this.bookings.findOne({
      where: { id: event.bookingId },
      relations: ['service'],
    });
    if (!booking) return;

    const business = await this.businesses.findOne({
      where: { id: booking.service.businessId },
      relations: ['owner'],
    });
    if (!business?.owner) return;

    try {
      await this.email.sendNewBookingAlert(booking, business, business.owner);
    } catch (err) {
      this.logger.error(
        `Failed to send new-booking alert for booking ${booking.id}`,
        err,
      );
    }
  }
  private async syncCalendarOnConfirm(
    booking: Booking,
  ): Promise<string | null> {
    try {
      const { joinLink } = await this.calendar.confirmBooking(booking);
      return joinLink;
    } catch (err) {
      this.logger.error(
        `Calendar confirm failed for booking ${booking.id}`,
        err as Error,
      );
      return null;
    }
  }

  private async syncCalendarOnCancel(booking: Booking): Promise<void> {
    try {
      await this.calendar.cancelBooking(booking);
    } catch (err) {
      this.logger.error(
        `Calendar cancel failed for booking ${booking.id}`,
        err as Error,
      );
    }
  }

  private async sendEmail(
    booking: Booking,
    business: Business,
    status: BookingStatus,
    meetLink?: string,
  ): Promise<void> {
    if (status === BookingStatus.NO_SHOW) return;
    try {
      await this.email.sendBookingStatusChange(
        booking,
        business,
        status,
        meetLink,
      );
    } catch (err) {
      this.logger.error(
        `Email send failed for booking ${booking.id} (${status})`,
        err as Error,
      );
    }
  }
}
