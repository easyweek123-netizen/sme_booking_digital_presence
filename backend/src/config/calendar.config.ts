import { registerAs } from '@nestjs/config';

export default registerAs('calendar', () => ({
  google: {
    clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    redirectUri:
      process.env.GOOGLE_OAUTH_REDIRECT_URI ||
      'http://localhost:3000/api/calendar/google/callback',
    scopes: [
      'openid',
      'email',
      'https://www.googleapis.com/auth/calendar.events',
    ],
  },
  cloakMasterKey: process.env.CLOAK_MASTER_KEY || '',
  cloakKeychain: process.env.CLOAK_KEYCHAIN || '',
  oauthStateSecret:
    process.env.CALENDAR_OAUTH_STATE_SECRET || 'dev-state-secret',
  frontendUrl: process.env.FRONTEND_APP_URL || 'http://localhost:5173',
}));
