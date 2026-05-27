import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from './entities/service-category.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';
import { UpdateServiceCategoryDto } from './dto/update-service-category.dto';

@Injectable()
export class ServiceCategoriesService {
  constructor(
    @InjectRepository(ServiceCategory)
    private readonly categoryRepository: Repository<ServiceCategory>,
  ) {}

  /**
   * Create a category for the given business. Ownership enforced upstream
   * by BusinessOwnershipGuard.
   */
  async create(
    businessId: number,
    createCategoryDto: CreateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    const category = this.categoryRepository.create({
      businessId,
      name: createCategoryDto.name,
      displayOrder: createCategoryDto.displayOrder ?? 0,
    });
    return this.categoryRepository.save(category);
  }

  /** Public: list categories for a business. */
  async findByBusiness(businessId: number): Promise<ServiceCategory[]> {
    return this.categoryRepository.find({
      where: { businessId },
      order: { displayOrder: 'ASC', createdAt: 'ASC' },
    });
  }

  /** Public: get a single category by id. */
  async findOne(id: number): Promise<ServiceCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) throw new NotFoundException('Service category not found');
    return category;
  }

  /**
   * Update a category scoped by businessId. Returns 404 if the category is
   * not in this business.
   */
  async update(
    id: number,
    businessId: number,
    updateCategoryDto: UpdateServiceCategoryDto,
  ): Promise<ServiceCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id, businessId },
    });
    if (!category) throw new NotFoundException('Service category not found');

    if (updateCategoryDto.name !== undefined) {
      category.name = updateCategoryDto.name;
    }
    if (updateCategoryDto.displayOrder !== undefined) {
      category.displayOrder = updateCategoryDto.displayOrder;
    }
    return this.categoryRepository.save(category);
  }

  /** Delete a category scoped by businessId. */
  async remove(id: number, businessId: number): Promise<void> {
    const category = await this.categoryRepository.findOne({
      where: { id, businessId },
    });
    if (!category) throw new NotFoundException('Service category not found');
    await this.categoryRepository.remove(category);
  }
}
