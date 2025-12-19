import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AuthService } from '../auth/auth.service';
import { verifyBusinessOwnership } from '../common';
import type { FirebaseUser } from '../common';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Create a new service for a business
   */
  async create(
    firebaseUser: FirebaseUser,
    createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    
    await verifyBusinessOwnership(
      this.businessRepository,
      createServiceDto.businessId,
      owner.id,
    );

    const service = this.serviceRepository.create({
      businessId: createServiceDto.businessId,
      categoryId: createServiceDto.categoryId || null,
      name: createServiceDto.name,
      description: createServiceDto.description || null,
      durationMinutes: createServiceDto.durationMinutes,
      price: createServiceDto.price,
      availableDays: createServiceDto.availableDays || null,
      imageUrl: createServiceDto.imageUrl || null,
      displayOrder: createServiceDto.displayOrder ?? 0,
      isActive: true,
    });

    return this.serviceRepository.save(service);
  }

  /**
   * Get all services for a business (public)
   */
  async findByBusiness(businessId: number): Promise<Service[]> {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.serviceRepository.find({
      where: { businessId, isActive: true },
      relations: ['category'],
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  /**
   * Get a single service by ID
   */
  async findOne(id: number): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // Entity Resolution Methods (for AI tool handlers)
  // ─────────────────────────────────────────────────────────────────────────────

  /**
   * Find a service by name within a business (case-insensitive)
   * Used by AI tool handlers for entity resolution
   */
  async findByNameAndBusiness(
    name: string,
    businessId: number,
  ): Promise<Service | null> {
    return this.serviceRepository.findOne({
      where: {
        name: ILike(name),
        businessId,
      },
      relations: ['category'],
    });
  }

  /**
   * Find a service by ID within a business (ownership check)
   * Used by AI tool handlers to verify service belongs to business
   */
  async findByIdAndBusiness(
    id: number,
    businessId: number,
  ): Promise<Service | null> {
    return this.serviceRepository.findOne({
      where: {
        id,
        businessId,
      },
      relations: ['category'],
    });
  }

  /**
   * Update a service
   */
  async update(
    id: number,
    firebaseUser: FirebaseUser,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    await verifyBusinessOwnership(this.businessRepository, service.businessId, owner.id);

    // Update fields
    if (updateServiceDto.categoryId !== undefined) {
      service.categoryId = updateServiceDto.categoryId;
    }
    if (updateServiceDto.name !== undefined) {
      service.name = updateServiceDto.name;
    }
    if (updateServiceDto.description !== undefined) {
      service.description = updateServiceDto.description || null;
    }
    if (updateServiceDto.durationMinutes !== undefined) {
      service.durationMinutes = updateServiceDto.durationMinutes;
    }
    if (updateServiceDto.price !== undefined) {
      service.price = updateServiceDto.price;
    }
    if (updateServiceDto.availableDays !== undefined) {
      service.availableDays = updateServiceDto.availableDays || null;
    }
    if (updateServiceDto.isActive !== undefined) {
      service.isActive = updateServiceDto.isActive;
    }
    if (updateServiceDto.imageUrl !== undefined) {
      service.imageUrl = updateServiceDto.imageUrl || null;
    }
    if (updateServiceDto.displayOrder !== undefined) {
      service.displayOrder = updateServiceDto.displayOrder;
    }

    return this.serviceRepository.save(service);
  }

  /**
   * Soft delete a service by setting isActive = false
   */
  async remove(id: number, firebaseUser: FirebaseUser): Promise<void> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    await verifyBusinessOwnership(this.businessRepository, service.businessId, owner.id);

    // Soft delete - mark as inactive
    service.isActive = false;
    await this.serviceRepository.save(service);
  }

}
