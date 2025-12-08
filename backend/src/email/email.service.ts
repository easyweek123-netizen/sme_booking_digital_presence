import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { Booking } from '../bookings/entities/booking.entity';
import { Business } from '../business/entities/business.entity';
import { Owner } from '../owner/entities/owner.entity';
import { generateGoogleCalendarLink } from '../common/utils/calendar';
import { newBookingAlertTemplate } from './templates/new-booking-alert';
import { bookingConfirmedTemplate } from './templates/booking-confirmed';
import { bookingCancelledTemplate } from './templates/booking-cancelled';
import { bookingCompletedTemplate } from './templates/booking-completed';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');
    
    if (apiKey) {
      this.resend = new Resend(apiKey);
      this.logger.log('Email service initialized with Resend');
    } else {
      this.resend = null;
      this.logger.warn('RESEND_API_KEY not set - emails will be logged only');
    }

    // Use Resend's default for testing, or custom domain later
    this.fromEmail = this.configService.get<string>('EMAIL_FROM') || 'email@bookeasy.com';
  }

  /**
   * Send new booking alert to business owner
   */
  async sendNewBookingAlert(
    booking: Booking,
    business: Business,
    owner: Owner,
  ): Promise<void> {
    const subject = `New booking request: ${booking.service?.name || 'Service'}`;
    
    const html = newBookingAlertTemplate({
      businessName: business.name,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      serviceName: booking.service?.name || 'Service',
      date: this.formatDate(booking.date),
      time: `${booking.startTime} - ${booking.endTime}`,
      reference: booking.reference,
    });

    await this.send({
      to: owner.email,
      subject,
      html,
    });
  }

  /**
   * Send booking confirmed email to customer
   */
  async sendBookingConfirmed(
    booking: Booking,
    business: Business,
  ): Promise<void> {
    const customerEmail = booking.customerEmail;
    
    if (!customerEmail) {
      this.logger.warn(`No email for customer ${booking.customerId}, skipping confirmation`);
      return;
    }

    const subject = `Booking Confirmed - ${business.name}`;
    
    // Generate Google Calendar link
    const bookingDateTime = this.combineDateTime(booking.date, booking.startTime);
    const durationMinutes = this.calculateDuration(booking.startTime, booking.endTime);
    
    const calendarLink = generateGoogleCalendarLink({
      title: `${booking.service?.name || 'Appointment'} at ${business.name}`,
      start: bookingDateTime,
      durationMinutes,
      location: business.address || undefined,
      description: `Reference: ${booking.reference}`,
    });

    const html = bookingConfirmedTemplate({
      businessName: business.name,
      customerName: booking.customerName,
      serviceName: booking.service?.name || 'Service',
      date: this.formatDate(booking.date),
      time: `${booking.startTime} - ${booking.endTime}`,
      reference: booking.reference,
      address: business.address || undefined,
      phone: business.phone || undefined,
      calendarLink,
    });

    await this.send({
      to: customerEmail,
      subject,
      html,
    });
  }

  /**
   * Send booking cancelled email to customer
   */
  async sendBookingCancelled(
    booking: Booking,
    business: Business,
  ): Promise<void> {
    const customerEmail = booking.customerEmail;
    
    if (!customerEmail) {
      this.logger.warn(`No email for customer ${booking.customerId}, skipping cancellation`);
      return;
    }

    const subject = `Booking Cancelled - ${business.name}`;
    
    const html = bookingCancelledTemplate({
      businessName: business.name,
      customerName: booking.customerName,
      serviceName: booking.service?.name || 'Service',
      date: this.formatDate(booking.date),
      time: `${booking.startTime} - ${booking.endTime}`,
      reference: booking.reference,
    });

    await this.send({
      to: customerEmail,
      subject,
      html,
    });
  }

  /**
   * Send booking completed (thank you) email to customer
   */
  async sendBookingCompleted(
    booking: Booking,
    business: Business,
  ): Promise<void> {
    const customerEmail = booking.customerEmail;
    
    if (!customerEmail) {
      this.logger.warn(`No email for customer ${booking.customerId}, skipping completion`);
      return;
    }

    const subject = `Thank you for visiting ${business.name}!`;
    
    const html = bookingCompletedTemplate({
      businessName: business.name,
      customerName: booking.customerName,
      serviceName: booking.service?.name || 'Service',
      date: this.formatDate(booking.date),
      reference: booking.reference,
    });

    await this.send({
      to: customerEmail,
      subject,
      html,
    });
  }

  /**
   * Core send method with fire-and-forget pattern
   */
  private async send(params: EmailParams): Promise<void> {
    const { to, subject, html } = params;

    if (!this.resend) {
      this.logger.log(`[Email Mock] To: ${to}, Subject: ${subject}`);
      return;
    }

    try {
      const result = await this.resend.emails.send({
        from: this.fromEmail,
        to,
        subject,
        html,
      });

      if (result.error) {
        this.logger.error(`Failed to send email to ${to}: ${result.error.message}`);
      } else {
        this.logger.log(`Email sent to ${to}: ${result.data?.id}`);
      }
    } catch (error) {
      this.logger.error(`Email send error: ${error instanceof Error ? error.message : error}`);
    }
  }

  // ==================== Helper Methods ====================

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  private combineDateTime(date: Date, time: string): Date {
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  }

  private calculateDuration(startTime: string, endTime: string): number {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return (endH * 60 + endM) - (startH * 60 + startM);
  }
}

