import { Entity, Column, PrimaryColumn, CreateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from './user.entity';
import { Course } from './course.entity';

@Entity('platoons')
export class Platoon {
  @ApiProperty({ example: '101A', description: 'Уникальный идентификатор взвода' })
  @PrimaryColumn()
  id: string;

  @ApiProperty({ example: 3, description: 'Курс обучения (1-5)' })
  @Column({ name: 'year_of_study' })
  yearOfStudy: number;

  @ApiProperty({ example: 'Взвод 2410', description: 'Описание взвода', nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: 1, description: 'ID направления подготовки', nullable: true })
  @Column({ name: 'cource_id', nullable: true })
  courseId: number;

  @ApiProperty({ type: () => Course, description: 'Направление подготовки', nullable: true })
  @ManyToOne(() => Course, { nullable: true })
  @JoinColumn({ name: 'cource_id' })
  course: Course;

  @OneToMany(() => User, user => user.platoon)
  users: User[];
}