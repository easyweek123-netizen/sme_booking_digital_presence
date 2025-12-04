import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { Business } from '../business/entities/business.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  /**
   * Create a new service for a business
   */
  async create(
    ownerId: number,
    createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    // Verify the business exists and belongs to the owner
    const business = await this.businessRepository.findOne({
      where: { id: createServiceDto.businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    if (business.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this business');
    }

    const service = this.serviceRepository.create({
      businessId: createServiceDto.businessId,
      name: createServiceDto.name,
      description: createServiceDto.description || null,
      durationMinutes: createServiceDto.durationMinutes,
      price: createServiceDto.price,
      availableDays: createServiceDto.availableDays || null,
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
      order: { createdAt: 'ASC' },
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

  /**
   * Update a service
   */
  async update(
    id: number,
    ownerId: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (service.business.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this service');
    }

    // Update fields
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

    return this.serviceRepository.save(service);
  }

  /**
   * Soft delete a service by setting isActive = false
   */
  async remove(id: number, ownerId: number): Promise<void> {
    const service = await this.serviceRepository.findOne({
      where: { id },
      relations: ['business'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Verify ownership
    if (service.business.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this service');
    }

    // Soft delete - mark as inactive
    service.isActive = false;
    await this.serviceRepository.save(service);
  }
}
