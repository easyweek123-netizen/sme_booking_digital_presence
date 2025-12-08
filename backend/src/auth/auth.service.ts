import { Injectable, BadRequestException } from '@nestjs/common';
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
   * Get or create an Owner from Firebase user data
   * Called by services for owner resolution
   */
  async getOrCreateOwner(firebaseUser: FirebaseUser): Promise<Owner> {
    // Try to find existing owner
    let owner = await this.ownerService.findByFirebaseUid(firebaseUser.uid);

    if (!owner) {
      // Validate email is present (required for owners)
      if (!firebaseUser.email) {
        throw new BadRequestException(
          'Email is required for owner registration. Please sign in with an email-based method.',
        );
      }

      // Auto-create owner on first login
      owner = await this.ownerService.create({
        firebaseUid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.name || firebaseUser.email.split('@')[0],
      });
    }

    return owner;
  }

  /**
   * Get current user info from Firebase user
   */
  async getCurrentUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
    const owner = await this.getOrCreateOwner(firebaseUser);
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
