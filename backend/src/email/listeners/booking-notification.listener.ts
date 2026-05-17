import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BookingStatusChangedEvent,
  BookingCreatedEvent,
} from '../../bookings/events';
import { Booking, BookingStatus } from '../../bookings/entities/booking.entity';
import { Business } from '../../business/entities/business.entity';
import { EmailService } from '../email.service';

@Injectable()
export class BookingNotificationListener {
  private readonly logger = new Logger(BookingNotificationListener.name);

  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  @OnEvent(BookingStatusChangedEvent.NAME, { async: true })
  async handle(event: BookingStatusChangedEvent): Promise<void> {
    if (event.to === BookingStatus.NO_SHOW) return; // matches existing behavior

    const booking = await this.bookingRepository.findOne({
      where: { id: event.bookingId },
      relations: ['service', 'customer'],
    });
    if (!booking) return;

    const business = await this.businessRepository.findOne({
      where: { id: booking.service.businessId },
    });
    if (!business) return;

    try {
      await this.emailService.sendBookingStatusChange(
        booking,
        business,
        event.to,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send ${event.to} email for booking ${booking.id}`,
        err,
      );
    }
  }

  @OnEvent(BookingCreatedEvent.NAME, { async: true })
  async handleCreated(event: BookingCreatedEvent): Promise<void> {
    const booking = await this.bookingRepository.findOne({
      where: { id: event.bookingId },
      relations: ['service'],
    });
    if (!booking) return;

    const business = await this.businessRepository.findOne({
      where: { id: booking.service.businessId },
      relations: ['owner'],
    });
    if (!business?.owner) return;

    try {
      await this.emailService.sendNewBookingAlert(
        booking,
        business,
        business.owner,
      );
    } catch (err) {
      this.logger.error(
        `Failed to send new-booking alert for booking ${booking.id}`,
        err,
      );
    }
  }
}
