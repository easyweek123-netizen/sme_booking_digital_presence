import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../../business/entities/business.entity';
import type { RequestWithBusiness, RequestWithOwner } from '../types';

/**
 * Looks up the authenticated owner's Business and attaches `businessId`
 * to the request. Use after FirebaseAuthGuard + OwnerResolverGuard for any
 * owner-scoped route. Sub-resources (services, categories, bookings) are
 * then scoped by `businessId` at the service layer (WHERE clause).
 */
@Injectable()
export class BusinessOwnershipGuard implements CanActivate {
  constructor(
    @InjectRepository(Business)
    private readonly businesses: Repository<Business>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<RequestWithOwner & { businessId?: number }>();
    if (typeof req.ownerId !== 'number') {
      throw new ForbiddenException('Owner context required');
    }
    if (typeof req.businessId === 'number') return true;
    const business = await this.businesses.findOne({
      where: { ownerId: req.ownerId },
    });
    if (!business) {
      throw new NotFoundException('No business for this owner');
    }
    (req as RequestWithBusiness).businessId = business.id;
    return true;
  }
}
