
import { Throttle } from '@nestjs/throttler';
import { Controller, Post, Body, Get, Headers, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Controller('feedback')
export class FeedbackController {
  private readonly adminSecret: string;

  constructor(
    private readonly feedbackService: FeedbackService,
    private readonly configService: ConfigService,
  ) {
    this.adminSecret = this.configService.get<string>('ADMIN_SECRET') || '';
    if (!this.adminSecret) {
      throw new Error('ADMIN_SECRET environment variable is required. Set it in your .env file.');
    }
  }

  @Post()
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  create(@Body() createFeedbackDto: CreateFeedbackDto) {
    return this.feedbackService.create(createFeedbackDto);
  }

  @Get()
  findAll(@Headers('x-admin-secret') secret: string) {
    if (secret !== this.adminSecret) {
      throw new UnauthorizedException('Invalid admin secret');
    }
    return this.feedbackService.findAll();
  }
}

