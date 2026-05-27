export class BookingCreatedEvent {
  static readonly NAME = 'booking.created' as const;
  constructor(public readonly bookingId: number) {}
}
