import { Module, Global } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Global() // Make FirebaseService available globally without importing FirebaseModule everywhere
@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}

