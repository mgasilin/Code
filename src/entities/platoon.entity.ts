import { Entity, PrimaryColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('platoons')
export class Platoon {
  @PrimaryColumn()
  id!: string;

  @Column({ name: 'year_of_study' })
  yearOfStudy!: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @OneToMany(() => User, user => user.platoon)
  users!: User[];
}