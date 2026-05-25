import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestWithBusiness } from '../types';

/**
 * Extract businessId from the request. Must be used after BusinessOwnershipGuard.
 */
export const BusinessId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<RequestWithBusiness>();
    return request.businessId;
  },
);
