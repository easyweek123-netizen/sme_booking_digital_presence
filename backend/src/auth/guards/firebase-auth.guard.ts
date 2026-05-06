import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../../firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = await this.firebaseService.verifyToken(token);
      request.firebaseUser = {
        uid: decoded.uid,
        email: decoded.email,
        name: decoded.name,
        emailVerified: decoded.email_verified === true,
      };
      return true;
    } catch (error) {
      console.error('Firebase auth error:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private extractToken(request: {
    headers: { authorization?: string };
  }): string | null {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.slice(7);
  }
}
