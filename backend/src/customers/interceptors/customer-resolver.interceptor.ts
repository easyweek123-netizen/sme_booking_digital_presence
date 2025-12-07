import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { FirebaseService } from '../../firebase/firebase.service';
import { CustomersService } from '../customers.service';

/**
 * Interceptor that resolves a Customer from a Firebase token.
 * 
 * - Extracts Firebase token from Authorization header
 * - Verifies token via FirebaseService
 * - Finds or creates Customer record
 * - Attaches customerId to request object
 * 
 * Use this interceptor on public booking endpoints that require
 * customer authentication.
 */
@Injectable()
export class CustomerResolverInterceptor implements NestInterceptor {
  constructor(
    private readonly firebaseService: FirebaseService,
    private readonly customersService: CustomersService,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('Authentication required to make a booking');
    }

    try {
      // Verify Firebase token
      const decoded = await this.firebaseService.verifyToken(token);

      // Find or create customer
      const customer = await this.customersService.findOrCreate(decoded.uid, {
        name: decoded.name || decoded.email?.split('@')[0] || 'Customer',
        email: decoded.email,
      });

      // Attach customerId to request
      request.customerId = customer.id;

      return next.handle();
    } catch (error) {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  private extractToken(request: { headers: { authorization?: string } }): string | null {
    const auth = request.headers.authorization;
    if (!auth?.startsWith('Bearer ')) return null;
    return auth.slice(7);
  }
}

