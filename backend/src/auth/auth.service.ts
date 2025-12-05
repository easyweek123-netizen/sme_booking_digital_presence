import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { OwnerService } from '../owner/owner.service';
import { RegisterDto, LoginDto } from './dto';
import { Owner } from '../owner/entities/owner.entity';
import type { AuthUser } from '../common/types';

export interface JwtPayload {
  sub: number;
  email: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly ownerService: OwnerService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { password, name } = registerDto;
    const email = registerDto.email.toLowerCase().trim();

    // Check if user already exists
    const existingOwner = await this.ownerService.findByEmail(email);
    if (existingOwner) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create owner
    const owner = await this.ownerService.create({
      email,
      name,
      passwordHash,
    });

    return this.buildAuthResponse(owner);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { password } = loginDto;
    const email = loginDto.email.toLowerCase().trim();

    // Find user
    const owner = await this.ownerService.findByEmail(email);
    if (!owner) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if user has password (not OAuth-only)
    if (!owner.passwordHash) {
      throw new UnauthorizedException(
        'This account uses Google sign-in. Please login with Google.',
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, owner.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.buildAuthResponse(owner);
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

  private buildAuthResponse(owner: Owner): AuthResponse {
    return {
      user: this.toAuthUser(owner),
      token: this.generateToken(owner),
    };
  }

  private generateToken(owner: Owner): string {
    const payload: JwtPayload = {
      sub: owner.id,
      email: owner.email,
    };
    return this.jwtService.sign(payload);
  }
}

