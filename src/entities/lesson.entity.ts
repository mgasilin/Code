import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Discipline } from './discipline.entity';
import { User } from './user.entity';

export enum LessonType {
  THEORY = 'theory',
  PRACTICS = 'practics',
  TEST = 'test'
}

@Entity('lessons')
@Index('unique_lesson_order', ['disciplineId', 'orderNumber'], { unique: true })
export class Lesson {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор занятия' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 1, description: 'ID дисциплины' })
  @Column({ name: 'discipline_id' })
  disciplineId: number;

  @ApiProperty({ example: 'Введение в SQL', description: 'Название занятия' })
  @Column()
  name: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер занятия' })
  @Column({ name: 'order_number' })
  orderNumber: number;

  @ApiProperty({ example: 'Основы SQL запросов', description: 'Описание занятия', nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ enum: LessonType, example: LessonType.THEORY, description: 'Тип занятия' })
  @Column({ 
    name: 'lesson_type',
    type: 'enum', 
    enum: LessonType 
  })
  lessonType: LessonType;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @ApiProperty({ type: () => User, description: 'Пользователь, создавший занятие', nullable: true })
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  createdBy: User;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Discipline, discipline => discipline.lessons)
  @JoinColumn({ name: 'discipline_id' })
  discipline: Discipline;
}