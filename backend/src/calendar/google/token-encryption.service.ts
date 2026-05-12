import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CloakKey,
  CloakKeychain,
  decryptString,
  encryptString,
  findKeyForMessage,
  makeKeychainSync,
  parseKeySync,
} from '@47ng/cloak';

/**
 * Encrypts/decrypts arbitrary strings (we use it for Google refresh tokens).
 * Backed by @47ng/cloak — AES-256-GCM with optional rotation keys in CLOAK_KEYCHAIN.
 */
@Injectable()
export class TokenEncryptionService implements OnModuleInit {
  private keychain!: CloakKeychain;
  private masterKeyStr!: string;

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const masterKey = this.config.get<string>('calendar.cloakMasterKey') || '';
    const keychainEnv = this.config.get<string>('calendar.cloakKeychain') || '';
    if (!masterKey) {
      throw new InternalServerErrorException('CLOAK_MASTER_KEY not configured');
    }
    const keys: CloakKey[] = [
      masterKey,
      ...keychainEnv
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
    ];
    this.keychain = makeKeychainSync(keys);
    this.masterKeyStr = masterKey;
  }

  encrypt(plaintext: string): Promise<string> {
    return encryptString(plaintext, parseKeySync(this.masterKeyStr));
  }

  decrypt(ciphertext: string): Promise<string> {
    const key = findKeyForMessage(ciphertext, this.keychain);
    return decryptString(ciphertext, key);
  }
}
