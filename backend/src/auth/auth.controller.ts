import {
  Controller,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { FirebaseAuthGuard } from './guards';
import type { AuthUser, RequestWithFirebaseUser } from '../common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @UseGuards(FirebaseAuthGuard)
  async getMe(@Request() req: RequestWithFirebaseUser): Promise<AuthUser> {
    return this.authService.getCurrentUser(req.firebaseUser);
  }
}
