import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Business } from '../../business/entities/business.entity';

/**
 * Verify that a business exists and belongs to the specified owner
 * @throws NotFoundException if business not found
 * @throws ForbiddenException if owner doesn't match
 */
export async function verifyBusinessOwnership(
  businessRepository: Repository<Business>,
  businessId: number,
  ownerId: number,
): Promise<Business> {
  const business = await businessRepository.findOne({
    where: { id: businessId },
  });

  if (!business) {
    throw new NotFoundException('Business not found');
  }

  if (business.ownerId !== ownerId) {
    throw new ForbiddenException('You do not own this business');
  }

  return business;
}

/**
 * Verify ownership from a loaded business entity
 * @throws ForbiddenException if owner doesn't match
 */
export function assertBusinessOwnership(
  business: Business,
  ownerId: number,
): void {
  if (business.ownerId !== ownerId) {
    throw new ForbiddenException('You do not own this business');
  }
}

