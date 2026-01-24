import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from '../../courses/dto/course-response';

export class DisciplineResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор дисциплины' })
  id: number;

  @ApiProperty({ example: 'Базы данных', description: 'Название дисциплины' })
  name: string;

  @ApiProperty({ example: 'Изучение основ баз данных', description: 'Описание дисциплины' })
  description: string;

  @ApiProperty({ example: 2, description: 'Год обучения (1-3)' })
  year_of_study: number;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  is_active: boolean;

  @ApiProperty({ example: 1, description: 'ID пользователя, создавшего дисциплину' })
  created_by: number;

  @ApiProperty({ type: () => CourseResponseDto, description: 'Курс (направление подготовки)' })
  course: CourseResponseDto;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  created_at: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  updated_at: Date;
}