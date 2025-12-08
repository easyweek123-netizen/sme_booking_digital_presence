import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { CustomerResolverInterceptor } from '../customers/interceptors';
import { Booking, BookingStatus } from './entities/booking.entity';
import type { RequestWithFirebaseUser, RequestWithCustomer } from '../common';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  /**
   * Get available time slots for a business on a specific date
   * GET /api/bookings/availability/:businessId?date=YYYY-MM-DD&serviceId=123
   * Public endpoint
   */
  @Get('availability/:businessId')
  async getAvailability(
    @Param('businessId', ParseIntPipe) businessId: number,
    @Query('date') date: string,
    @Query('serviceId', ParseIntPipe) serviceId: number,
  ): Promise<{ slots: string[] }> {
    return this.bookingsService.getAvailability(businessId, date, serviceId);
  }

  /**
   * Create a new booking
   * POST /api/bookings
   * Requires Firebase authentication (customer must be signed in)
   */
  @Post()
  @UseInterceptors(CustomerResolverInterceptor)
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithCustomer,
    @Body() createBookingDto: CreateBookingDto,
  ): Promise<Booking> {
    return this.bookingsService.create(createBookingDto, req.customerId);
  }

  /**
   * Get all bookings for a business (owner only)
   * GET /api/bookings/business/:businessId?status=CONFIRMED&from=YYYY-MM-DD&to=YYYY-MM-DD
   * Protected endpoint
   */
  @Get('business/:businessId')
  @UseGuards(FirebaseAuthGuard)
  async findByBusiness(
    @Request() req: RequestWithFirebaseUser,
    @Param('businessId', ParseIntPipe) businessId: number,
    @Query('status') status?: BookingStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<Booking[]> {
    return this.bookingsService.findByBusiness(businessId, req.firebaseUser, {
      status,
      from,
      to,
    });
  }

  /**
   * Get booking stats for a business (owner only)
   * GET /api/bookings/stats/:businessId
   * Protected endpoint
   */
  @Get('stats/:businessId')
  @UseGuards(FirebaseAuthGuard)
  async getStats(
    @Request() req: RequestWithFirebaseUser,
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<{ total: number; today: number }> {
    return this.bookingsService.getStats(businessId, req.firebaseUser);
  }

  /**
   * Get booking status by reference code
   * GET /api/bookings/status/:reference
   * Public endpoint (for customer status lookup)
   */
  @Get('status/:reference')
  async findByReference(@Param('reference') reference: string): Promise<Booking> {
    return this.bookingsService.findByReference(reference);
  }

  /**
   * Get pending bookings count for a business (owner only)
   * GET /api/bookings/pending-count/:businessId
   * Protected endpoint
   */
  @Get('pending-count/:businessId')
  @UseGuards(FirebaseAuthGuard)
  async getPendingCount(
    @Request() req: RequestWithFirebaseUser,
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<{ count: number }> {
    const count = await this.bookingsService.getPendingCount(businessId, req.firebaseUser);
    return { count };
  }

  /**
   * Get a single booking by ID
   * GET /api/bookings/:id
   * Public endpoint (for confirmation pages)
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookingsService.findOne(id);
  }

  /**
   * Update booking status (cancel or complete)
   * PATCH /api/bookings/:id/status
   * Protected endpoint (owner only)
   */
  @Patch(':id/status')
  @UseGuards(FirebaseAuthGuard)
  async updateStatus(
    @Request() req: RequestWithFirebaseUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    return this.bookingsService.updateStatus(
      id,
      req.firebaseUser,
      updateBookingStatusDto.status,
    );
  }
}
