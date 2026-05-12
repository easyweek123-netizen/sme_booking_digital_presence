import { BookingStatus } from '../entities/booking.entity';

export class BookingStatusChangedEvent {
  static readonly NAME = 'booking.status_changed' as const;
  constructor(
    public readonly bookingId: number,
    public readonly from: BookingStatus,
    public readonly to: BookingStatus,
  ) {}
}
