import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit(): void {
    this.initializeFirebase();
  }

  private initializeFirebase(): void {
    // Check if already initialized
    if (admin.apps.length > 0) {
      this.app = admin.apps[0]!;
      return;
    }

    // Option 1: Service account JSON string (for production/Render)
    const serviceAccountJson = this.configService.get<string>(
      'FIREBASE_SERVICE_ACCOUNT',
    );

    // Option 2: Path to service account file (for local development)
    const serviceAccountPath = this.configService.get<string>(
      'GOOGLE_APPLICATION_CREDENTIALS',
    );

    if (serviceAccountJson) {
      // Parse JSON string and initialize
      const serviceAccount = JSON.parse(serviceAccountJson);
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('🔥 Firebase Admin initialized from JSON string');
    } else if (serviceAccountPath) {
      // Initialize with file path (using application default credentials)
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const serviceAccount = require(
        serviceAccountPath.startsWith('/')
          ? serviceAccountPath
          : `${process.cwd()}/${serviceAccountPath}`,
      );
      this.app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('🔥 Firebase Admin initialized from file:', serviceAccountPath);
    } else {
      throw new Error(
        'Firebase configuration not found. Set FIREBASE_SERVICE_ACCOUNT or GOOGLE_APPLICATION_CREDENTIALS.',
      );
    }
  }

  /**
   * Verify a Firebase ID token and return the decoded token
   */
  async verifyToken(token: string): Promise<DecodedIdToken> {
    return admin.auth().verifyIdToken(token);
  }

  /**
   * Get user info from Firebase by UID
   */
  async getUser(uid: string): Promise<admin.auth.UserRecord> {
    return admin.auth().getUser(uid);
  }

  /**
   * Get user info from Firebase by email
   */
  async getUserByEmail(email: string): Promise<admin.auth.UserRecord | null> {
    try {
      return await admin.auth().getUserByEmail(email);
    } catch {
      return null;
    }
  }
}

