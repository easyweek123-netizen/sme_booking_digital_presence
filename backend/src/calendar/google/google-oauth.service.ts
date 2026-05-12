import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, Auth } from 'googleapis';
import * as jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

interface OAuthStatePayload {
  ownerId: number;
  nonce: string;
}

export interface GoogleTokenExchangeResult {
  refreshToken: string;
  accessToken: string;
  scope: string;
  email: string;
}

@Injectable()
export class GoogleOAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly redirectUri: string;
  private readonly scopes: string[];
  private readonly stateSecret: string;

  constructor(config: ConfigService) {
    this.clientId = config.get<string>('calendar.google.clientId') || '';
    this.clientSecret =
      config.get<string>('calendar.google.clientSecret') || '';
    this.redirectUri = config.get<string>('calendar.google.redirectUri') || '';
    this.scopes = config.get<string[]>('calendar.google.scopes') || [];
    this.stateSecret = config.get<string>('calendar.oauthStateSecret') || '';
  }

  buildAuthUrl(ownerId: number): string {
    const state = jwt.sign(
      { ownerId, nonce: randomUUID() } satisfies OAuthStatePayload,
      this.stateSecret,
      { expiresIn: '10m' },
    );
    const url = this.newClient().generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      include_granted_scopes: true,
      scope: this.scopes,
      state,
    });
    return url;
  }

  verifyState(state: string): OAuthStatePayload {
    try {
      const decoded = jwt.verify(state, this.stateSecret) as OAuthStatePayload;
      if (typeof decoded.ownerId !== 'number') throw new Error('bad payload');
      return decoded;
    } catch {
      throw new BadRequestException('Invalid or expired OAuth state');
    }
  }

  async exchangeCode(code: string): Promise<GoogleTokenExchangeResult> {
    const client = this.newClient();
    const { tokens } = await client.getToken(code);
    if (!tokens.refresh_token) {
      throw new BadRequestException(
        'Google did not return a refresh token. Ask the user to remove BookEasy from their Google account permissions and try again.',
      );
    }
    if (!tokens.access_token || !tokens.id_token) {
      throw new InternalServerErrorException(
        'Incomplete token response from Google',
      );
    }
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: this.clientId,
    });
    const email = ticket.getPayload()?.email;
    if (!email)
      throw new InternalServerErrorException('id_token missing email claim');
    return {
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      scope: tokens.scope || '',
      email,
    };
  }

  async revokeRefreshToken(refreshToken: string): Promise<void> {
    try {
      await this.newClient().revokeToken(refreshToken);
    } catch {
      console.error('Failed to revoke refresh token', refreshToken);
    }
  }

  private newClient(): Auth.OAuth2Client {
    return new google.auth.OAuth2(
      this.clientId,
      this.clientSecret,
      this.redirectUri,
    );
  }
}
