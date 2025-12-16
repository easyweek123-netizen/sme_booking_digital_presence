import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  Request,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { FirebaseAuthGuard } from '../auth/guards';
import { Note } from './entities/note.entity';
import { OwnerResolverInterceptor } from '../common';
import type { RequestWithOwner } from '../common';

@Controller('notes')
@UseGuards(FirebaseAuthGuard)
@UseInterceptors(OwnerResolverInterceptor)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  /**
   * Create a new note
   * POST /api/notes
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Request() req: RequestWithOwner,
    @Body() createNoteDto: CreateNoteDto,
  ): Promise<Note> {
    return this.notesService.create(createNoteDto, req.ownerId);
  }

  /**
   * Get all notes for the authenticated owner
   * GET /api/notes?customerId=123&bookingId=456
   */
  @Get()
  async findAll(
    @Request() req: RequestWithOwner,
    @Query('customerId', new ParseIntPipe({ optional: true }))
    customerId?: number,
    @Query('bookingId', new ParseIntPipe({ optional: true }))
    bookingId?: number,
  ): Promise<Note[]> {
    return this.notesService.findAll(req.ownerId, { customerId, bookingId });
  }

  /**
   * Get a single note by ID
   * GET /api/notes/:id
   */
  @Get(':id')
  async findOne(
    @Request() req: RequestWithOwner,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Note> {
    return this.notesService.findOne(id, req.ownerId);
  }

  /**
   * Update a note
   * PATCH /api/notes/:id
   */
  @Patch(':id')
  async update(
    @Request() req: RequestWithOwner,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.update(id, updateNoteDto, req.ownerId);
  }

  /**
   * Delete a note
   * DELETE /api/notes/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Request() req: RequestWithOwner,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    return this.notesService.remove(id, req.ownerId);
  }
}
