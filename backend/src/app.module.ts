import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { OwnerModule } from './owner/owner.module';
import { BusinessModule } from './business/business.module';
import { ServicesModule } from './services/services.module';
import { BookingsModule } from './bookings/bookings.module';
import { BusinessCategoriesModule } from './business-categories/business-categories.module';
import { configuration, databaseConfig, appConfig, jwtConfig } from './config';

@Module({
  imports: [
    // Load configuration first
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      load: [configuration, databaseConfig, appConfig, jwtConfig],
      envFilePath: ['.env.local', '.env'], // Load .env.local first, then .env
    }),
    DatabaseModule,
    AuthModule,
    OwnerModule,
    BusinessModule,
    ServicesModule,
    BookingsModule,
    BusinessCategoriesModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
