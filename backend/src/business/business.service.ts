import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Business } from './entities/business.entity';
import { Service } from '../services/entities/service.entity';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { AuthService } from '../auth/auth.service';
import { assertBusinessOwnership } from '../common';
import type { FirebaseUser } from '../common';

@Injectable()
export class BusinessService {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
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
    firebaseUser: FirebaseUser,
    createBusinessDto: CreateBusinessDto,
  ): Promise<Business> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    const ownerId = owner.id;

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
      business.logoUrl = createBusinessDto.logoUrl || null;
      business.brandColor = createBusinessDto.brandColor || null;
      business.workingHours = createBusinessDto.workingHours || null;
      business.businessTypeId = null; // Category is optional, can be set later

      const savedBusiness = await queryRunner.manager.save(business);

      // Create all services (if provided)
      const services = (createBusinessDto.services || []).map((serviceDto) => {
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
      return this.findByOwnerIdOrFail(ownerId);
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      // Handle duplicate slug error
      // MySQL: ER_DUP_ENTRY (code 1062), PostgreSQL: code 23505
      const isDuplicateError =
        error.code === 'ER_DUP_ENTRY' ||
        error.code === '23505' ||
        error.constraint?.includes('slug');
      
      if (isDuplicateError) {
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
   * Find business by Firebase user
   */
  async findByOwner(firebaseUser: FirebaseUser): Promise<Business> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    return this.findByOwnerIdOrFail(owner.id);
  }

  /**
   * Find business by owner ID (internal use - throws if not found)
   */
  private async findByOwnerIdOrFail(ownerId: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { ownerId },
      relations: ['services', 'services.category', 'businessType'],
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return business;
  }

  /**
   * Find business by owner ID (returns null if not found)
   */
  async findByOwnerId(ownerId: number): Promise<Business | null> {
    return this.businessRepository.findOne({
      where: { ownerId },
      relations: ['services', 'services.category', 'businessType'],
    });
  }

  /**
   * Find business by ID
   */
  async findOne(id: number): Promise<Business> {
    const business = await this.businessRepository.findOne({
      where: { id },
      relations: ['services', 'services.category', 'businessType'],
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
      relations: ['services', 'services.category', 'businessType'],
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
    firebaseUser: FirebaseUser,
    updateBusinessDto: UpdateBusinessDto,
  ): Promise<Business> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    const business = await this.findOne(id);

    // Verify ownership
    assertBusinessOwnership(business, owner.id);

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
    if (updateBusinessDto.website !== undefined) {
      business.website = updateBusinessDto.website || null;
    }
    if (updateBusinessDto.instagram !== undefined) {
      business.instagram = updateBusinessDto.instagram || null;
    }
    if (updateBusinessDto.logoUrl !== undefined) {
      business.logoUrl = updateBusinessDto.logoUrl || null;
    }
    if (updateBusinessDto.brandColor !== undefined) {
      business.brandColor = updateBusinessDto.brandColor || null;
    }
    if (updateBusinessDto.workingHours !== undefined) {
      business.workingHours = updateBusinessDto.workingHours;
    }
    if (updateBusinessDto.coverImageUrl !== undefined) {
      business.coverImageUrl = updateBusinessDto.coverImageUrl || null;
    }
    if (updateBusinessDto.aboutContent !== undefined) {
      business.aboutContent = updateBusinessDto.aboutContent || null;
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

  /**
   * Delete a business by ID
   */
  async remove(id: number): Promise<void> {
    await this.businessRepository.delete(id);
  }
}
