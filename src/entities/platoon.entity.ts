import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('platoons')
export class Platoon {
  @ApiProperty({ example: '101A', description: 'Уникальный идентификатор взвода' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ example: 3, description: 'Курс обучения (1-3)' })
  @Column({ name: 'year_of_study' })
  yearOfStudy: number;

  @ApiProperty({ example: 'Взвод 2410', description: 'Описание взвода', nullable: true })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => User, user => user.platoon)
  users: User[];
}