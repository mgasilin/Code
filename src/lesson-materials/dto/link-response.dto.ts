import { ApiProperty } from '@nestjs/swagger';
import { LinkType } from '../../entities/material-link.entity';

export class LinkResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор ссылки' })
  id: number;

  @ApiProperty({ example: 5, description: 'ID занятия' })
  lesson_id: number;

  @ApiProperty({ 
    enum: LinkType, 
    example: LinkType.EXTERNAL,
    description: 'Тип ссылки'
  })
  link_type: LinkType;

  @ApiProperty({ example: 'https://youtube.com/watch?v=123', description: 'URL ссылки' })
  url: string;

  @ApiProperty({ example: 'Видео-лекция по теме', description: 'Заголовок ссылки', nullable: true })
  title: string | null;

  @ApiProperty({ example: 'Подробное объяснение с примерами', description: 'Описание ресурса', nullable: true })
  description: string | null;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  created_at: Date;
}