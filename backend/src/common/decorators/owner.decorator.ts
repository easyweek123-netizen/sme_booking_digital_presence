import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestWithOwner } from '../interceptors/owner-resolver.interceptor';

/**
 * Decorator to extract ownerId from request.
 * Must be used with OwnerResolverInterceptor.
 */
export const OwnerId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<RequestWithOwner>();
    return request.ownerId;
  },
);

