import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './entities/note.entity';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

interface NotesFilter {
  customerId?: number;
  bookingId?: number;
}

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepository: Repository<Note>,
  ) {}

  /**
   * Create a new note
   */
  async create(createNoteDto: CreateNoteDto, ownerId: number): Promise<Note> {
    const note = this.noteRepository.create({
      content: createNoteDto.content,
      customerId: createNoteDto.customerId ?? null,
      bookingId: createNoteDto.bookingId ?? null,
      ownerId,
    });

    return this.noteRepository.save(note);
  }

  /**
   * Find all notes for owner with optional filters
   */
  async findAll(ownerId: number, filters: NotesFilter = {}): Promise<Note[]> {
    const queryBuilder = this.noteRepository
      .createQueryBuilder('note')
      .where('note.ownerId = :ownerId', { ownerId });

    if (filters.customerId) {
      queryBuilder.andWhere('note.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }

    if (filters.bookingId) {
      queryBuilder.andWhere('note.bookingId = :bookingId', {
        bookingId: filters.bookingId,
      });
    }

    // Order by most recent first
    queryBuilder.orderBy('note.createdAt', 'DESC');

    return queryBuilder.getMany();
  }

  /**
   * Find one note by ID
   */
  async findOne(id: number, ownerId: number): Promise<Note> {
    const note = await this.noteRepository.findOne({
      where: { id },
    });

    if (!note) {
      throw new NotFoundException('Note not found');
    }

    // Verify ownership
    if (note.ownerId !== ownerId) {
      throw new ForbiddenException('You do not have access to this note');
    }

    return note;
  }

  /**
   * Update a note
   */
  async update(
    id: number,
    updateNoteDto: UpdateNoteDto,
    ownerId: number,
  ): Promise<Note> {
    const note = await this.findOne(id, ownerId); // Verifies ownership

    note.content = updateNoteDto.content;
    return this.noteRepository.save(note);
  }

  /**
   * Delete a note
   */
  async remove(id: number, ownerId: number): Promise<void> {
    const note = await this.findOne(id, ownerId); // Verifies ownership
    await this.noteRepository.remove(note);
  }
}
