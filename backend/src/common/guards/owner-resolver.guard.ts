import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from '../../auth/auth.service';
import type { RequestWithFirebaseUser, RequestWithOwner } from '../types';

@Injectable()
export class OwnerResolverGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<RequestWithFirebaseUser & { ownerId?: number }>();

    if (!req.firebaseUser) {
      throw new UnauthorizedException('Owner context required');
    }

    if (typeof req.ownerId !== 'number') {
      const owner = await this.authService.getRegisteredOwner(req.firebaseUser);
      (req as RequestWithOwner).ownerId = owner.id;
    }

    return true;
  }
}
