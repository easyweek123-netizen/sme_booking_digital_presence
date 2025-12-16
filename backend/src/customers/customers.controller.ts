import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { FirebaseAuthGuard } from '../auth/guards';
import { Customer } from './entities/customer.entity';
import { OwnerResolverInterceptor } from '../common';
import type { RequestWithOwner } from '../common';

@Controller('customers')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(OwnerResolverInterceptor, ClassSerializerInterceptor)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Get all customers for the authenticated owner
   * GET /api/customers
   */
  @Get()
  async findAll(@Request() req: RequestWithOwner): Promise<Customer[]> {
    return this.customersService.findAllForOwner(req.ownerId);
  }

  /**
   * Get a single customer with bookings
   * GET /api/customers/:id
   */
  @Get(':id')
  async findOne(
    @Request() req: RequestWithOwner,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Customer> {
    return this.customersService.findOneForOwner(id, req.ownerId);
  }
}
