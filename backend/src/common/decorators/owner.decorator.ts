import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestWithOwner } from '../types';

/**
 * Decorator to extract ownerId from request.
 * Must be used after FirebaseAuthGuard and OwnerResolverGuard.
 */
export const OwnerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<RequestWithOwner>();
    return request.ownerId;
  },
);
