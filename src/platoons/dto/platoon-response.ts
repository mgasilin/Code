import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from '../../courses/dto/course-response';

export class PlatoonResponseDto {
  @ApiProperty({ example: '101A', description: 'ID взвода' })
  id: string;

  @ApiProperty({ example: 3, description: 'Курс обучения (1-5)' })
  year_of_study: number;

  @ApiProperty({ example: 'Взвод 2410', description: 'Описание взвода' })
  description: string;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  is_active: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  created_at: Date;

  @ApiProperty({ type: () => CourseResponseDto, description: 'Направление подготовки', nullable: true })
  course?: CourseResponseDto;
}