import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Lesson } from './lesson.entity';

export enum LinkType {
  INTERNAL_LIBRARY = 'internal_library',
  EXTERNAL = 'external',
  TEST_MODULE = 'test_module'
}

@Entity('material_links')
@Index('idx_links_lesson', ['lessonId'])
@Index('idx_links_type', ['linkType'])
export class MaterialLink {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор ссылки' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 5, description: 'ID занятия' })
  @Column({ name: 'lesson_id' })
  lessonId: number;

  @ApiProperty({ enum: LinkType, description: 'Тип ссылки' })
  @Column({ 
    name: 'link_type',
    type: 'enum', 
    enum: LinkType 
  })
  linkType: LinkType;

  @ApiProperty({ example: 'https://example.com', description: 'URL ссылки' })
  @Column({ length: 1000 })
  url: string;

  @ApiProperty({ example: 'Полезная статья', description: 'Заголовок ссылки' })
  @Column({ length: 255, nullable: true })
  title: string;

  @ApiProperty({ example: 'Описание материала', description: 'Описание ссылки' })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Lesson, lesson => lesson.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'lesson_id' })
  lesson: Lesson;
}