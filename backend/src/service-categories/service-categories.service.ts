import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { Business } from '../business/entities/business.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';
import { AuthService } from '../auth/auth.service';
import { verifyBusinessOwnership } from '../common';
import type { FirebaseUser } from '../common';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly categoryRepository: Repository<ServiceCategory>,
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
    private readonly authService: AuthService,
  ) {}

  /**
   * Create a new service category for a business
   */
  async create(
    firebaseUser: FirebaseUser,
    createCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    
    await verifyBusinessOwnership(
      this.businessRepository,
      createCategoryDto.businessId,
      owner.id,
    );

    const category = this.categoryRepository.create({
      businessId: createCategoryDto.businessId,
      name: createCategoryDto.name,
      displayOrder: createCategoryDto.displayOrder ?? 0,
    });

    return this.categoryRepository.save(category);
  }

  /**
   * Get all categories for a business (public)
   */
  async findByBusiness(businessId: number): Promise<ServiceCategory[]> {
    const business = await this.businessRepository.findOne({
      where: { id: businessId },
    });

    if (!business) {
      throw new NotFoundException('Business not found');
    }

    return this.categoryRepository.find({
      where: { businessId },
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  /**
   * Get a single category by ID
   */
  async findOne(id: number): Promise<ServiceCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    return category;
  }

  /**
   * Update a service category
   */
  async update(
    id: number,
    firebaseUser: FirebaseUser,
    updateCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    // Verify ownership
    await verifyBusinessOwnership(this.businessRepository, category.businessId, owner.id);

    // Update fields
    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.displayOrder !== undefined) {
      category.displayOrder = updateCategoryDto.displayOrder;
    }

    return this.categoryRepository.save(category);
  }

  /**
   * Delete a service category
   */
  async remove(id: number, firebaseUser: FirebaseUser): Promise<void> {
    const owner = await this.authService.getOrCreateOwner(firebaseUser);
    
    const category = await this.categoryRepository.findOne({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Service category not found');
    }

    // Verify ownership
    await verifyBusinessOwnership(this.businessRepository, category.businessId, owner.id);

    // Delete category - services will have categoryId set to null (onDelete: 'SET NULL')
    await this.categoryRepository.remove(category);
  }
}

