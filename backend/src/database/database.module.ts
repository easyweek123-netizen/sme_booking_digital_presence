import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const host = configService.get<string>('database.host')!;
        const port = configService.get<number>('database.port')!;
        const database = configService.get<string>('database.database')!;

        new Logger('DatabaseModule').log(
          `Connecting to postgres://${host}:${port}/${database}`,
        );

        return {
          type: 'postgres' as const,
          host,
          port,
          username: configService.get<string>('database.username')!,
          password: configService.get<string>('database.password')!,
          database,
          ssl: configService.get<boolean | object>('database.ssl') || undefined,
          synchronize: configService.get<boolean>('database.synchronize')!,
          logging: configService.get<boolean>('database.logging')!,
          autoLoadEntities: true,
          retryAttempts: 3,
          retryDelay: 3000,
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule implements OnModuleInit {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const host = this.configService.get<string>('database.host');
    const port = this.configService.get<number>('database.port');
    const database = this.configService.get<string>('database.database');
    this.logger.log(`✅ Database connected: postgres://${host}:${port}/${database}`);
  }
}
