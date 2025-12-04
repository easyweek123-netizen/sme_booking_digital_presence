import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { JwtAuthGuard } from '../auth/guards';
import { Booking, BookingStatus } from './entities/booking.entity';
import type { RequestWithUser } from '../common';

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
   * Public endpoint (no auth required - customers book without accounts)
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createBookingDto: CreateBookingDto): Promise<Booking> {
    return this.bookingsService.create(createBookingDto);
  }

  /**
   * Get all bookings for a business (owner only)
   * GET /api/bookings/business/:businessId?status=CONFIRMED&from=YYYY-MM-DD&to=YYYY-MM-DD
   * Protected endpoint
   */
  @Get('business/:businessId')
  @UseGuards(JwtAuthGuard)
  async findByBusiness(
    @Request() req: RequestWithUser,
    @Param('businessId', ParseIntPipe) businessId: number,
    @Query('status') status?: BookingStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<Booking[]> {
    return this.bookingsService.findByBusiness(businessId, req.user.id, {
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
  @UseGuards(JwtAuthGuard)
  async getStats(
    @Request() req: RequestWithUser,
    @Param('businessId', ParseIntPipe) businessId: number,
  ): Promise<{ total: number; today: number }> {
    return this.bookingsService.getStats(businessId, req.user.id);
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
  @UseGuards(JwtAuthGuard)
  async updateStatus(
    @Request() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBookingStatusDto: UpdateBookingStatusDto,
  ): Promise<Booking> {
    return this.bookingsService.updateStatus(
      id,
      req.user.id,
      updateBookingStatusDto.status,
    );
  }
}
