import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  @Get('health')
  async getHealth(): Promise<{ status: string; timestamp: string; environment: string }> {
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException({
        status: 'error',
        timestamp: new Date().toISOString(),
        database: 'unreachable',
      });
    }

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      environment: this.configService.get<string>('app.nodeEnv') || 'unknown',
    };
  }
}
