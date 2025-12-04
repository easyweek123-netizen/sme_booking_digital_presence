import { Controller, Get } from '@nestjs/common';
import { BusinessCategoriesService } from './business-categories.service';

@Controller('business-categories')
export class BusinessCategoriesController {
  constructor(
    private readonly businessCategoriesService: BusinessCategoriesService,
  ) {}

  /**
   * GET /api/business-categories
   * Returns all active business categories with their nested types
   */
  @Get()
  findAll() {
    return this.businessCategoriesService.findAll();
  }
}
