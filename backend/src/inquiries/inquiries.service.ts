import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inquiry } from './entities/inquiry.entity';
import { CreateInquiryDto } from './dto/create-inquiry.dto';
import { EmailService } from '../email/email.service';

@Injectable()
export class InquiriesService {
  private readonly logger = new Logger(InquiriesService.name);

  constructor(
    @InjectRepository(Inquiry)
    private readonly inquiriesRepository: Repository<Inquiry>,
    private readonly emailService: EmailService,
  ) {}

  async create(dto: CreateInquiryDto): Promise<Inquiry> {
    const inquiry = this.inquiriesRepository.create({
      name: dto.name,
      email: dto.email,
      company: dto.company ?? null,
      budget: dto.budget,
      message: dto.message,
      source: 'services_page',
    });

    const saved = await this.inquiriesRepository.save(inquiry);

    this.emailService
      .sendInquiryNotification(saved)
      .catch((error) =>
        this.logger.error(`Failed to send inquiry notification: ${error}`),
      );

    this.emailService
      .sendInquiryAcknowledgement(saved)
      .catch((error) =>
        this.logger.error(`Failed to send inquiry acknowledgement: ${error}`),
      );

    return saved;
  }

  async findAll(): Promise<Inquiry[]> {
    return this.inquiriesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}
