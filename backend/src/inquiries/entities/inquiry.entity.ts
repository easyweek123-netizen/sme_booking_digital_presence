import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('inquiries')
export class Inquiry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  company: string | null;

  @Column({ type: 'varchar', length: 50 })
  budget: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ type: 'varchar', length: 50, default: 'services_page' })
  source: string;

  @CreateDateColumn()
  createdAt: Date;
}
