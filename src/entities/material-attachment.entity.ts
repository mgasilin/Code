import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from './lesson.entity';
import { User } from './user.entity';

@Entity('material_attachments')
@Index('idx_attachments_lesson', ['lessonId'])
@Index('idx_attachments_type', ['fileType'])
export class MaterialAttachment {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор файла' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 5, description: 'ID занятия' })
  @Column({ name: 'lesson_id' })
  lessonId: number;

  @ApiProperty({ example: 'лекция.pdf', description: 'Оригинальное имя файла' })
  @Column({ name: 'file_name', length: 255 })
  fileName: string;

  @ApiProperty({ example: 'application/pdf', description: 'MIME тип файла' })
  @Column({ name: 'file_type', length: 50, nullable: true })
  fileType: string;

  @ApiProperty({ example: 'uploads/attachments/123e4567-e89b-12d3-a456-426614174000.pdf', description: 'Путь к файлу' })
  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @ApiProperty({ example: 1048576, description: 'Размер файла в байтах' })
  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @ApiProperty({ example: 42, description: 'ID пользователя, загрузившего файл', nullable: true })
  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата загрузки' })
  @CreateDateColumn({ name: 'uploaded_at' })
  uploadedAt: Date;

  @ManyToOne(() => Lesson, lesson => lesson.attachments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by' })
  uploader: User;
}