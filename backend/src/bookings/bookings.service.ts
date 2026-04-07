import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { Business } from '../business/entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { EmailService } from '../email/email.service';
import { SLOT_INTERVAL_MINUTES, DayOfWeek } from '../common/constants';
import { WorkingHours } from '../common/types';
import { generateBookingReference, verifyBusinessOwnership } from '../common';
import { formatLocalYmd } from '../common/time/local-date';

interface AvailabilityResult {
  slots: string[];
}

interface BookingsFilter {
  status?: BookingStatus;
  from?: string;
  to?: string;
}

/** Aggregated booking counts for dashboard and AI tools */
export interface BusinessBookingStats {
  total: number;
  today: number;
  pending: number;
  byStatus: Record<BookingStatus, number>;
}

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Get available time slots for a specific date and service
   */
  async getAvailability(
    businessId: number,
    date: string,
    serviceId: number,
  ): Promise<AvailabilityResult> {
    // 0. Validate date format (YYYY-MM-DD)
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD.');
    }

    const dateObj = new Date(date + 'T00:00:00');
    if (isNaN(dateObj.getTime())) {
      throw new BadRequestException('Invalid date.');
    }

    // Don't allow booking in the past
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    if (dateObj < todayStart) {
      return { slots: [] };
    }

    // 1. Fetch business with working hours
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // 2. Fetch the service to get duration
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, businessId, isActive: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found or inactive');
    }

    // 3. Get day of week from date
    const dayIndex = dateObj.getDay(); // 0 = Sunday, 1 = Monday, etc.
    // Convert to our format (monday, tuesday, etc.)
    const dayMap: DayOfWeek[] = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ];
    const dayOfWeek = dayMap[dayIndex];

    // 4. Check if business is open on this day
    const workingHours = business.workingHours as WorkingHours;
    if (!workingHours || !workingHours[dayOfWeek]?.isOpen) {
      return { slots: [] };
    }

    // 5. Check if service is available on this day (if availableDays is set)
    if (service.availableDays && service.availableDays.length > 0) {
      if (!service.availableDays.includes(dayOfWeek)) {
        return { slots: [] };
      }
    }

    const daySchedule = workingHours[dayOfWeek];
    const openTime = daySchedule.openTime; // e.g., "09:00"
    const closeTime = daySchedule.closeTime; // e.g., "18:00"

    // 6. Generate all possible slots
    const allSlots = this.generateSlots(
      openTime,
      closeTime,
      service.durationMinutes,
    );

    // 7. Fetch existing bookings for this date (excluding cancelled)
    const existingBookings = await this.bookingRepository.find({
      where: {
        businessId,
        date: new Date(date),
        status: Not(BookingStatus.CANCELLED),
      },
    });

    // 8. Filter out slots that overlap with existing bookings
    const availableSlots = allSlots.filter((slot) => {
      const slotStart = this.timeToMinutes(slot);
      const slotEnd = slotStart + service.durationMinutes;

      return !existingBookings.some((booking) => {
        const bookingStart = this.timeToMinutes(booking.startTime);
        const bookingEnd = this.timeToMinutes(booking.endTime);

        // Check for overlap
        return slotStart < bookingEnd && slotEnd > bookingStart;
      });
    });

    // 9. Filter out past slots if the date is today
    const today = new Date();
    const todayStr = this.getLocalDateString(today);
    
    if (date === todayStr) {
      const currentMinutes = today.getHours() * 60 + today.getMinutes();
      // Add a buffer of 30 minutes - can't book slots that start within 30 min
      const minBookableTime = currentMinutes + 30;
      
      return {
        slots: availableSlots.filter(
          (slot) => this.timeToMinutes(slot) >= minBookableTime,
        ),
      };
    }

    return { slots: availableSlots };
  }

  /**
   * Create a new booking
   */
  async create(createBookingDto: CreateBookingDto, customerId: number): Promise<Booking> {
    const { businessId, serviceId, date, startTime } = createBookingDto;

    // 1. Verify business exists
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    // 2. Verify service exists and belongs to business
    const service = await this.serviceRepository.findOne({
      where: { id: serviceId, businessId, isActive: true },
    });

    if (!service) {
      throw new NotFoundException('Service not found or inactive');
    }

    // 3. Check slot is still available (prevent double-booking)
    const availability = await this.getAvailability(businessId, date, serviceId);
    
    if (!availability.slots.includes(startTime)) {
      throw new BadRequestException(
        'This time slot is no longer available. Please choose another time.',
      );
    }

    // 4. Calculate end time
    const endTime = this.addMinutesToTime(startTime, service.durationMinutes);

    // 5. Create the booking (defaults to PENDING status)
    const booking = this.bookingRepository.create({
      businessId,
      serviceId,
      customerId,
      customerName: createBookingDto.customerName,
      customerEmail: createBookingDto.customerEmail,
      date: new Date(date),
      startTime,
      endTime,
      reference: generateBookingReference(),
      // status defaults to PENDING via entity
    });

    const savedBooking = await this.bookingRepository.save(booking);

    // Load booking with relations for email
    const fullBooking = await this.findOne(savedBooking.id);

    // Send new booking alert to owner (fire-and-forget)
    const businessWithOwner = await this.businessRepository.findOne({
      where: { id: businessId },
      relations: ['owner'],
    });

    if (businessWithOwner?.owner) {
      this.emailService
        .sendNewBookingAlert(fullBooking, businessWithOwner, businessWithOwner.owner)
        .catch((err) => this.logger.error('Failed to send new booking alert', err));
    }

    return fullBooking;
  }

  /**
   * Find booking by ID with service info
   */
  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['service'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Find booking by reference code (public - for customer status lookup)
   */
  async findByReference(reference: string): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { reference: reference.toUpperCase() },
      relations: ['service', 'business'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  /**
   * Find a booking for the authenticated owner of a business.
   * Verifies business ownership first, then loads by id (preferred) or reference within that business.
   */
  async findBookingForOwner(
    businessId: number,
    ownerId: number,
    lookup: { id?: number; reference?: string },
  ): Promise<Booking | null> {
    const hasId = lookup.id !== undefined;
    const hasRef =
      lookup.reference !== undefined && lookup.reference.trim().length > 0;
    if (!hasId && !hasRef) return null;

    await verifyBusinessOwnership(this.businessRepository, businessId, ownerId);

    if (hasId) {
      return this.bookingRepository.findOne({
        where: { id: lookup.id!, businessId },
        relations: ['service'],
      });
    }

    return this.bookingRepository.findOne({
      where: {
        reference: lookup.reference!.toUpperCase(),
        businessId,
      },
      relations: ['service'],
    });
  }

  /**
   * Get count of pending bookings for a business
   */
  async getPendingCount(
    businessId: number,
    ownerId: number,
  ): Promise<number> {
    await verifyBusinessOwnership(this.businessRepository, businessId, ownerId);

    return this.bookingRepository.count({
      where: {
        businessId,
        status: BookingStatus.PENDING,
      },
    });
  }

  /**
   * Find all bookings for a business with optional filters
   */
  async findByBusiness(
    businessId: number,
    ownerId: number,
    filters: BookingsFilter = {},
  ): Promise<Booking[]> {
    await verifyBusinessOwnership(this.businessRepository, businessId, ownerId);

    // Build query
    const queryBuilder = this.bookingRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.service', 'service')
      .where('booking.businessId = :businessId', { businessId });

    if (filters.status) {
      queryBuilder.andWhere('booking.status = :status', {
        status: filters.status,
      });
    }

    if (filters.from) {
      queryBuilder.andWhere('booking.date >= :from', { from: filters.from });
    }

    if (filters.to) {
      queryBuilder.andWhere('booking.date <= :to', { to: filters.to });
    }

    // Order by date and time
    queryBuilder
      .orderBy('booking.date', 'ASC')
      .addOrderBy('booking.startTime', 'ASC');

    return queryBuilder.getMany();
  }

  /**
   * Update booking status
   */
  async updateStatus(
    id: number,
    ownerId: number,
    status: BookingStatus,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    await verifyBusinessOwnership(this.businessRepository, booking.businessId, ownerId);

    const previousStatus = booking.status;
    booking.status = status;
    await this.bookingRepository.save(booking);

    const updatedBooking = await this.findOne(id);

    // Send status change emails to customer (skip NO_SHOW)
    if (previousStatus !== status && status !== BookingStatus.NO_SHOW) {
      const business = await this.businessRepository.findOne({
        where: { id: booking.businessId },
      });

      if (business) {
        this.sendStatusChangeEmail(updatedBooking, business, status)
          .catch((err) => this.logger.error(`Failed to send ${status} email`, err));
      }
    }

    return updatedBooking;
  }

  /**
   * Get booking stats for a business (two light aggregates: GROUP BY status + today count).
   */
  async getStats(
    businessId: number,
    ownerId: number,
  ): Promise<BusinessBookingStats> {
    await verifyBusinessOwnership(this.businessRepository, businessId, ownerId);

    const today = new Date();
    const todayDate = new Date(this.getLocalDateString(today));

    const statusRows = await this.bookingRepository
      .createQueryBuilder('booking')
      .select('booking.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('booking.businessId = :businessId', { businessId })
      .groupBy('booking.status')
      .getRawMany<{ status: string; count: string }>();

    const byStatus = {} as Record<BookingStatus, number>;
    for (const s of Object.values(BookingStatus)) {
      byStatus[s] = 0;
    }
    for (const row of statusRows) {
      const status = row.status as BookingStatus;
      if (status in byStatus) {
        byStatus[status] = Number(row.count);
      }
    }

    const total = Object.entries(byStatus)
      .filter(([key]) => key !== BookingStatus.CANCELLED)
      .reduce((sum, [, n]) => sum + n, 0);

    const pending = byStatus[BookingStatus.PENDING];

    const todayCount = await this.bookingRepository.count({
      where: {
        businessId,
        date: todayDate,
        status: Not(BookingStatus.CANCELLED),
      },
    });

    return {
      total,
      today: todayCount,
      pending,
      byStatus,
    };
  }

  // ==================== Helper Methods ====================

  /**
   * Send appropriate email based on status change
   */
  private async sendStatusChangeEmail(
    booking: Booking,
    business: Business,
    status: BookingStatus,
  ): Promise<void> {
    switch (status) {
      case BookingStatus.CONFIRMED:
        await this.emailService.sendBookingConfirmed(booking, business);
        break;
      case BookingStatus.CANCELLED:
        await this.emailService.sendBookingCancelled(booking, business);
        break;
      case BookingStatus.COMPLETED:
        await this.emailService.sendBookingCompleted(booking, business);
        break;
      default:
        // NO_SHOW and PENDING don't send emails
        break;
    }
  }

  /**
   * Generate time slots between open and close times
   */
  private generateSlots(
    openTime: string,
    closeTime: string,
    serviceDuration: number,
  ): string[] {
    const slots: string[] = [];
    const openMinutes = this.timeToMinutes(openTime);
    const closeMinutes = this.timeToMinutes(closeTime);

    // Generate slots at SLOT_INTERVAL_MINUTES intervals
    for (
      let time = openMinutes;
      time + serviceDuration <= closeMinutes;
      time += SLOT_INTERVAL_MINUTES
    ) {
      slots.push(this.minutesToTime(time));
    }

    return slots;
  }

  /**
   * Convert "HH:mm" to minutes since midnight
   */
  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  /**
   * Convert minutes since midnight to "HH:mm"
   */
  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  /**
   * Add minutes to a time string
   */
  private addMinutesToTime(time: string, minutesToAdd: number): string {
    const totalMinutes = this.timeToMinutes(time) + minutesToAdd;
    return this.minutesToTime(totalMinutes);
  }

  /** Local calendar day YYYY-MM-DD (aligned with server_clock). */
  private getLocalDateString(date: Date): string {
    return formatLocalYmd(date);
  }
}
