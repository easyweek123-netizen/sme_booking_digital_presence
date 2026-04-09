import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { OwnerService } from '../owner/owner.service';
import { Owner } from '../owner/entities/owner.entity';
import type { AuthUser, FirebaseUser } from '../common/types';

export interface AuthResponse {
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(private readonly ownerService: OwnerService) {}

  /**
   * Pure lookup -- throws if owner is not registered.
   * Used by interceptors and services for auth resolution.
   */
  async getOwner(firebaseUser: FirebaseUser): Promise<Owner> {
    const owner = await this.ownerService.findByFirebaseUid(firebaseUser.uid);
    if (!owner) {
      throw new UnauthorizedException('Owner not registered');
    }
    return owner;
  }

  /**
   * Find-or-create an Owner from Firebase user data.
   * Only used by getCurrentUser (GET /auth/me) -- the single registration entry point.
   */
  async registerOwner(firebaseUser: FirebaseUser): Promise<Owner> {
    let owner = await this.ownerService.findByFirebaseUid(firebaseUser.uid);

    if (!owner) {
      if (!firebaseUser.email) {
        throw new BadRequestException(
          'Email is required for owner registration. Please sign in with an email-based method.',
        );
      }

      owner = await this.ownerService.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name || firebaseUser.email.split('@')[0],
      });
    }

    return owner;
  }

  /**
   * Get current user info from Firebase user (registers if first sign-in)
   */
  async getCurrentUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
    const owner = await this.registerOwner(firebaseUser);
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
