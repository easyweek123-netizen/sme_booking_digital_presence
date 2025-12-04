import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessCategory } from './entities/business-category.entity';

@Injectable()
export class BusinessCategoriesService {
  constructor(
    @InjectRepository(BusinessCategory)
    private readonly categoryRepository: Repository<BusinessCategory>,
  ) {}

  /**
   * Get all active business categories with their nested active types
   */
  async findAll(): Promise<BusinessCategory[]> {
    return this.categoryRepository.find({
      where: { isActive: true },
      relations: ['types'],
      order: { name: 'ASC' },
    });
  }

  /**
   * Get a single category by ID with its types
   */
  async findOne(id: number): Promise<BusinessCategory | null> {
    return this.categoryRepository.findOne({
      where: { id, isActive: true },
      relations: ['types'],
    });
  }
}
