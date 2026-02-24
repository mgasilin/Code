import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from './lesson.entity';

@Entity('material_texts')
@Index('idx_texts_lesson', ['lessonId'])
@Index('idx_texts_order', ['lessonId', 'orderNumber'])
export class MaterialText {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор текстового материала' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 5, description: 'ID занятия' })
  @Column({ name: 'lesson_id' })
  lessonId: number;

  @ApiProperty({ example: 'Введение', description: 'Заголовок текста' })
  @Column({ length: 255 })
  title: string;

  @ApiProperty({ example: 'Полный текст лекции...', description: 'Содержание текстового материала' })
  @Column({ name: 'material_text', type: 'text' })
  materialText: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер для сортировки', default: 0 })
  @Column({ name: 'order_number', default: 0 })
  orderNumber: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Lesson, lesson => lesson.texts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}