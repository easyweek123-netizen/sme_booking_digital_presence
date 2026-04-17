import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { OwnerService } from '../owner/owner.service';
import { Owner } from '../owner/entities/owner.entity';
import type { AuthUser, FirebaseUser } from '../common/types';
import { normalizeOwnerEmail } from '../common/utils/email';

export interface AuthResponse {
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(private readonly ownerService: OwnerService) {}

  /**
   * Resolve Owner for this Firebase session: by UID, else merge by verified email, else insert.
   * Used by GET /auth/me and OwnerResolverInterceptor so UID changes do not strand users.
   */
  async resolveRegisteredOwner(firebaseUser: FirebaseUser): Promise<Owner> {
    const byUid = await this.ownerService.findByFirebaseUid(firebaseUser.uid);
    if (byUid) {
      return byUid;
    }

    if (!firebaseUser.email) {
      throw new BadRequestException(
        'Email is required for owner registration. Please sign in with an email-based method.',
      );
    }

    const canonical = normalizeOwnerEmail(firebaseUser.email);
    const byEmail = await this.ownerService.findByCanonicalEmail(canonical);

    if (byEmail) {
      if (byEmail.firebaseUid === firebaseUser.uid) {
        return byEmail;
      }

      if (firebaseUser.emailVerified !== true) {
        throw new ForbiddenException(
          'Verify your email before signing in, or contact support if this account already exists.',
        );
      }

      const name =
        firebaseUser.name && firebaseUser.name.trim().length > 0
          ? firebaseUser.name
          : byEmail.name;

      const updated = await this.ownerService.update(byEmail.id, {
        firebaseUid: firebaseUser.uid,
        email: canonical,
        name,
      });

      if (!updated) {
        throw new ForbiddenException('Could not update owner record.');
      }

      return updated;
    }

    return this.ownerService.create({
      firebaseUid: firebaseUser.uid,
      email: canonical,
      name: firebaseUser.name || canonical.split('@')[0],
    });
  }

  /**
   * Get current user info from Firebase user (registers if first sign-in)
   */
  async getCurrentUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
    const owner = await this.resolveRegisteredOwner(firebaseUser);
    return this.toAuthUser(owner);
  }

  async validateOwner(userId: number): Promise<Owner | null> {
    return this.ownerService.findOne(userId);
  }

  toAuthUser(owner: Owner): AuthUser {
    return {
      id: owner.id,
      email: owner.email,
      name: owner.name,
    };
  }
}
