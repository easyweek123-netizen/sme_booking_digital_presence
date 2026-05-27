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
  UsePipes,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import type { BookingStats } from './bookings.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { BookingCreateSchema } from '@bookeasy/shared';
import type { BookingCreateInput } from '@bookeasy/shared';
import { UpdateBookingStatusDto } from './dto/update-booking.dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { CustomerResolverInterceptor } from '../customers/interceptors';
import {
  BusinessId,
  BusinessOwnershipGuard,
  OwnerResolverGuard,
} from '../common';
import { Entitlement, EntitlementGuard } from '../entitlements';
import { Booking, BookingStatus } from './entities/booking.entity';
import type { RequestWithCustomer } from '../common';

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  @Post()
  @UseInterceptors(CustomerResolverInterceptor)
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(BookingCreateSchema))
  async create(
    @Request() req: RequestWithCustomer,
    @Body() body: BookingCreateInput,
  ): Promise<Booking> {
    return this.bookings.create(body, req.customerId);
  }

  @Get()
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  async findOwnerBookings(
    @BusinessId() businessId: number,
    @Query('status') status?: BookingStatus,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ): Promise<Booking[]> {
    return this.bookings.findByBusiness(businessId, { status, from, to });
  }

  @Get('stats')
  @UseGuards(FirebaseAuthGuard, OwnerResolverGuard, BusinessOwnershipGuard)
  async getOwnerBookingStats(
    @BusinessId() businessId: number,
  ): Promise<BookingStats> {
    return this.bookings.getStats(businessId);
  }

  @Get('status/:reference')
  async findByReference(
    @Param('reference') reference: string,
  ): Promise<Booking> {
    return this.bookings.findByReference(reference);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Booking> {
    return this.bookings.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(
    FirebaseAuthGuard,
    OwnerResolverGuard,
    BusinessOwnershipGuard,
    EntitlementGuard,
  )
  @Entitlement('bookings.confirm', {
    when: (req) =>
      (req.body as { status?: string } | undefined)?.status ===
      BookingStatus.CONFIRMED,
  })
  async updateStatus(
    @BusinessId() businessId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookingStatusDto,
  ): Promise<Booking> {
    return this.bookings.updateStatusForBusiness(id, businessId, body.status);
  }
}
