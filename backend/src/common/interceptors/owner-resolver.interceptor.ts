import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import type { RequestWithFirebaseUser } from '../types';

export interface RequestWithOwner extends RequestWithFirebaseUser {
  ownerId: number;
}

@Injectable()
export class OwnerResolverInterceptor implements NestInterceptor {
  constructor(private authService: AuthService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context
      .switchToHttp()
      .getRequest<RequestWithFirebaseUser>();

    const owner = await this.authService.getOrCreateOwner(request.firebaseUser);
    (request as RequestWithOwner).ownerId = owner.id;

    return next.handle();
  }
}

