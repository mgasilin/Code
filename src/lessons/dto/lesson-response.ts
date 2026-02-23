import { ApiProperty } from '@nestjs/swagger';
import { LessonType } from '../../entities/lesson.entity';
import { DisciplineResponseDto } from '../../disciplines/dto/discipline-response';
import { LinkResponseDto } from '../../lesson-materials/dto/link-response.dto';
import { TextResponseDto } from '../../lesson-materials/dto/text-response.dto';
import { AttachmentResponseDto } from '../../lesson-materials/dto/attachment-response.dto';


export class LessonResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор занятия' })
  id: number;

  @ApiProperty({ example: 'Введение в SQL', description: 'Название занятия' })
  name: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер занятия' })
  order_number: number;

  @ApiProperty({ example: 'Основы SQL запросов', description: 'Описание занятия' })
  description: string;

  @ApiProperty({ enum: LessonType, example: LessonType.THEORY, description: 'Тип занятия' })
  lesson_type: LessonType;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  is_active: boolean;

  @ApiProperty({ example: 1, description: 'ID пользователя, создавшего занятие' })
  created_by: number;

  @ApiProperty({ type: () => DisciplineResponseDto, description: 'Дисциплина' })
  discipline: DisciplineResponseDto;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  created_at: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  updated_at: Date;

  @ApiProperty({ type: [LinkResponseDto], description: 'Ссылки' })
  links: LinkResponseDto[];

  @ApiProperty({ type: [TextResponseDto], description: 'Текстовые материалы' })
  texts: TextResponseDto[];

  @ApiProperty({ type: [AttachmentResponseDto], description: 'Файлы' })
  attachments: AttachmentResponseDto[];
}