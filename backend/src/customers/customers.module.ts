import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CustomerResolverInterceptor } from './interceptors';

@Module({
  imports: [TypeOrmModule.forFeature([Customer])],
  providers: [CustomersService, CustomerResolverInterceptor],
  exports: [CustomersService, CustomerResolverInterceptor],
})
export class CustomersModule {}
