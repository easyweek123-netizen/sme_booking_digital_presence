import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Note } from './entities/note.entity';
import { NoteToolHandlers } from './tools';
import { AuthModule } from '../auth/auth.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Note]), AuthModule, CustomersModule],
  controllers: [NotesController],
  providers: [NotesService, ...NoteToolHandlers],
  exports: [NotesService],
})
export class NotesModule {}
