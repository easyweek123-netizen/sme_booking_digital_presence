import {
  Controller,
  Get,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guards';
import type { AuthUser, RequestWithFirebaseUser } from '../common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(FirebaseAuthGuard)
  @HttpCode(HttpStatus.OK)
  async register(@Request() req: RequestWithFirebaseUser): Promise<AuthUser> {
    return this.authService.register(req.firebaseUser);
  }

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getMe(@Request() req: RequestWithFirebaseUser): Promise<AuthUser> {
    return this.authService.getCurrentUser(req.firebaseUser);
  }
}
