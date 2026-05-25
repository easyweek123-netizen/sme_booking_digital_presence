import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { InquiriesService } from './inquiries.service';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { InquiryCreateSchema } from '@bookeasy/shared';
import type { InquiryCreateInput } from '@bookeasy/shared';

@Controller('inquiries')
export class InquiriesController {
  private readonly adminSecret: string;

  constructor(
    private readonly inquiriesService: InquiriesService,
    private readonly configService: ConfigService,
  ) {
    this.adminSecret = this.configService.get<string>('ADMIN_SECRET') || '';
    if (!this.adminSecret) {
      throw new Error(
        'ADMIN_SECRET environment variable is required. Set it in your .env file.',
      );
    }
  }

  @Post()
  @Throttle({ default: { ttl: 3600000, limit: 5 } })
  @UsePipes(new ZodValidationPipe(InquiryCreateSchema))
  create(@Body() body: InquiryCreateInput) {
    return this.inquiriesService.create(body);
  }

  @Get()
  findAll(@Headers('x-admin-secret') secret: string) {
    if (secret !== this.adminSecret) {
      throw new UnauthorizedException('Invalid admin secret');
    }
    return this.inquiriesService.findAll();
  }
}
