import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { Business } from '../../business/entities/business.entity';

@Entity('owners')
export class Owner {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 128, unique: true })
  firebaseUid: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @OneToMany(() => Business, (business) => business.owner)
  businesses: Business[];

  @CreateDateColumn()
  createdAt: Date;
}
