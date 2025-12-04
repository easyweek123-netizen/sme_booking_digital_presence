import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Business } from './entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Generate URL-friendly slug: full-business-name + 4 random alphanumeric
   */
  private generateSlug(name: string): string {
    // Convert name to lowercase, replace spaces/special chars with hyphens
    const baseName = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Generate 4 char random suffix (lowercase letters + numbers)
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 4; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return `${baseName}-${suffix}`;
  }

  /**
   * Create a new business with services in a transaction
   */
  async create(
    ownerId: number,
    createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    // Check if owner already has a business
    const existingBusiness = await this.businessRepository.findOne({
      where: { ownerId },
    });

    if (existingBusiness) {
      throw new ConflictException('You already have a business registered');
    }

    // Use a transaction to create business and services together
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Create the business
      const business = new Business();
      business.ownerId = ownerId;
      business.name = createBusinessDto.name;
      business.slug = this.generateSlug(createBusinessDto.name);
      business.phone = createBusinessDto.phone || null;
      business.description = createBusinessDto.description || null;
      business.address = createBusinessDto.address || null;
      business.city = createBusinessDto.city || null;
      business.workingHours = createBusinessDto.workingHours;
      business.businessTypeId = null; // Category is optional, can be set later

      const savedBusiness = await queryRunner.manager.save(business);

      // Create all services
      const services = createBusinessDto.services.map((serviceDto) => {
        const service = new Service();
        service.businessId = savedBusiness.id;
        service.name = serviceDto.name;
        service.durationMinutes = serviceDto.durationMinutes;
        service.price = serviceDto.price;
        service.availableDays = serviceDto.availableDays || null;
        service.isActive = true;
        return service;
      });

      await queryRunner.manager.save(services);

      await queryRunner.commitTransaction();

      // Return the business with services
      return this.findByOwner(ownerId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      // Handle duplicate slug error (MySQL error code 1062)
      if (error.code === 'ER_DUP_ENTRY' && error.message?.includes('slug')) {
        throw new ConflictException(
          'Business with this name already exists. Please choose a different name.',
        );
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Find business by owner ID with services
   */
  async findByOwner(ownerId: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { ownerId },
      relations: ['services', 'businessType'],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  /**
   * Find business by ID
   */
  async findOne(id: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['services', 'businessType'],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  /**
   * Find business by slug (public)
   */
  async findBySlug(slug: string): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { slug },
      relations: ['services', 'businessType'],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  /**
   * Update business
   */
  async update(
    id: number,
    ownerId: number,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    const business = await this.findOne(id);

    // Verify ownership
    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this business');
    }

    // Update fields
    if (updateBusinessDto.name !== undefined) {
      business.name = updateBusinessDto.name;
    }
    if (updateBusinessDto.phone !== undefined) {
      business.phone = updateBusinessDto.phone || null;
    }
    if (updateBusinessDto.description !== undefined) {
      business.description = updateBusinessDto.description || null;
    }
    if (updateBusinessDto.address !== undefined) {
      business.address = updateBusinessDto.address || null;
    }
    if (updateBusinessDto.city !== undefined) {
      business.city = updateBusinessDto.city || null;
    }
    if (updateBusinessDto.workingHours !== undefined) {
      business.workingHours = updateBusinessDto.workingHours;
    }

    await this.businessRepository.save(business);

    return this.findOne(id);
  }

  /**
   * Check if owner has a business
   */
  async hasBusinessForOwner(ownerId: number): Promise<boolean> {
    const business = await this.businessRepository.findOne({
      where: { ownerId },
    });
    return !!business;
  }
}
