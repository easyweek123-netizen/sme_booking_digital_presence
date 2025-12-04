import { Module, Logger, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { DatabaseType } from '../config/database.config';

type ConnectionOptions = Partial<MysqlConnectionOptions> | Partial<PostgresConnectionOptions>;

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const type = configService.get<DatabaseType>('database.type')!;
        const host = configService.get<string>('database.host')!;
        const port = configService.get<number>('database.port')!;
        const database = configService.get<string>('database.database')!;
        const username = configService.get<string>('database.username')!;
        const password = configService.get<string>('database.password')!;
        const ssl = configService.get<boolean | object>('database.ssl');
        const synchronize = configService.get<boolean>('database.synchronize')!;
        const logging = configService.get<boolean>('database.logging')!;

        const logger = new Logger('DatabaseModule');
        logger.log(`Connecting to ${type} database at ${host}:${port}/${database}`);

        const baseConfig = {
          host,
          port,
          username,
          password,
          database,
          autoLoadEntities: true,
          synchronize,
          logging,
          retryAttempts: 3,
          retryDelay: 3000,
        };

        if (type === 'postgres') {
          return {
            ...baseConfig,
            type: 'postgres' as const,
            ssl: ssl || undefined,
          };
        }

        return {
          ...baseConfig,
          type: 'mysql' as const,
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
    const type = this.configService.get<string>('database.type');
    const host = this.configService.get<string>('database.host');
    const port = this.configService.get<number>('database.port');
    const database = this.configService.get<string>('database.database');

    this.logger.log(`✅ Database connected: ${type}://${host}:${port}/${database}`);
  }
}
