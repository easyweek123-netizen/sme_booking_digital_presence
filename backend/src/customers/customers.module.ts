import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomersService } from './customers.service';
import { CustomersController } from './customers.controller';
import { Customer } from './entities/customer.entity';
import { CustomerResolverInterceptor } from './interceptors';
import { CustomerToolHandlers } from './tools';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Customer]), AuthModule],
  controllers: [CustomersController],
  providers: [
    CustomersService,
    CustomerResolverInterceptor,
    ...CustomerToolHandlers,
  ],
  exports: [CustomersService, CustomerResolverInterceptor],
})
export class CustomersModule {}
