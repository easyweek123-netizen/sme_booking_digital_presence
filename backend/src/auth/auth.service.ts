import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { OwnerService } from '../owner/owner.service';
import { Owner } from '../owner/entities/owner.entity';
import type { AuthUser, FirebaseUser } from '../common/types';
import { normalizeOwnerEmail } from '../common/utils/email';

const PG_UNIQUE_VIOLATION = '23505';

export interface AuthResponse {
  user: AuthUser;
}

@Injectable()
export class AuthService {
  constructor(private readonly ownerService: OwnerService) {}

  /**
   * Read-only owner resolution for guards and GET /auth/me. Never writes.
   * Throws if this Firebase session has no provisioned owner yet — clients
   * must call POST /auth/register first (done on login).
   */
  async getRegisteredOwner(firebaseUser: FirebaseUser): Promise<Owner> {
    const owner = await this.ownerService.findByFirebaseUid(firebaseUser.uid);
    if (!owner) {
      throw new UnauthorizedException('Owner not registered');
    }
    return owner;
  }

  /**
   * Provision the Owner for this Firebase session (idempotent).
   * Resolve by UID, else merge by verified email, else insert.
   * Safe under concurrency: a duplicate insert from parallel first-login
   * requests is recovered by re-reading the winning row.
   */
  async registerOwner(firebaseUser: FirebaseUser): Promise<Owner> {
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

    try {
      return await this.ownerService.create({
        firebaseUid: firebaseUser.uid,
        email: canonical,
        name: firebaseUser.name || canonical.split('@')[0],
      });
    } catch (err) {
      if (
        err instanceof QueryFailedError &&
        (err as { code?: string }).code === PG_UNIQUE_VIOLATION
      ) {
        const existing =
          (await this.ownerService.findByFirebaseUid(firebaseUser.uid)) ??
          (await this.ownerService.findByCanonicalEmail(canonical));
        if (existing) {
          return existing;
        }
      }
      throw err;
    }
  }

  /** GET /auth/me — read-only current user. */
  async getCurrentUser(firebaseUser: FirebaseUser): Promise<AuthUser> {
    const owner = await this.getRegisteredOwner(firebaseUser);
    return this.toAuthUser(owner);
  }

  /** POST /auth/register — provision (or resolve) the owner on login. */
  async register(firebaseUser: FirebaseUser): Promise<AuthUser> {
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
