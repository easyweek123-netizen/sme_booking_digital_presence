import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CalendarEvent } from '../entities/calendar-event.entity';

@Injectable()
export class CalendarEventRepository {
  constructor(
    @InjectRepository(CalendarEvent)
    private readonly repo: Repository<CalendarEvent>,
  ) {}

  findByBookingAndCalendar(
    bookingId: number,
    calendarId: number,
  ): Promise<CalendarEvent | null> {
    return this.repo.findOne({ where: { bookingId, calendarId } });
  }

  findByBooking(bookingId: number): Promise<CalendarEvent | null> {
    return this.repo.findOne({ where: { bookingId } });
  }

  async record(input: {
    bookingId: number;
    calendarId: number;
    externalEventId: string;
  }): Promise<void> {
    await this.repo.save({
      bookingId: input.bookingId,
      calendarId: input.calendarId,
      externalEventId: input.externalEventId,
    });
  }

  async deleteById(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
