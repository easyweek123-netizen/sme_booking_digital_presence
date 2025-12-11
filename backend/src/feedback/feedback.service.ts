import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class FeedbackService {
  private readonly logger = new Logger(FeedbackService.name);

  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private readonly emailService: EmailService,
  ) {}

  async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = this.feedbackRepository.create({
      email: createFeedbackDto.email,
      message: createFeedbackDto.message,
      source: createFeedbackDto.source || 'pricing_page',
    });

    const saved = await this.feedbackRepository.save(feedback);

    // Send email notification (fire-and-forget)
    this.emailService
      .sendFeedbackNotification(saved.email, saved.message, saved.source)
      .catch((error) => {
        this.logger.error(`Failed to send feedback notification: ${error}`);
      });

    return saved;
  }

  async findAll(): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}

