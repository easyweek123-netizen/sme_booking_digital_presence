import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto';
import { Customer } from './entities/customer.entity';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  /**
   * Create a customer directly (for admin use)
   * POST /api/customers
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
  ): Promise<Customer> {
    return this.customersService.create(createCustomerDto);
  }
}
