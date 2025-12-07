import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Owner } from './entities/owner.entity';
import { CreateOwnerDto } from './dto/create-owner.dto';
import { UpdateOwnerDto } from './dto/update-owner.dto';

@Injectable()
export class OwnerService {
  constructor(
    @InjectRepository(Owner)
    private readonly ownerRepository: Repository<Owner>,
  ) {}

  async create(createOwnerDto: CreateOwnerDto): Promise<Owner> {
    const owner = this.ownerRepository.create(createOwnerDto);
    return this.ownerRepository.save(owner);
  }

  async findAll(): Promise<Owner[]> {
    return this.ownerRepository.find();
  }

  async findOne(id: number): Promise<Owner | null> {
    return this.ownerRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<Owner | null> {
    return this.ownerRepository.findOne({ where: { email } });
  }

  async findByFirebaseUid(firebaseUid: string): Promise<Owner | null> {
    return this.ownerRepository.findOne({ where: { firebaseUid } });
  }

  async update(id: number, updateOwnerDto: UpdateOwnerDto): Promise<Owner | null> {
    await this.ownerRepository.update(id, updateOwnerDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.ownerRepository.delete(id);
  }
}
