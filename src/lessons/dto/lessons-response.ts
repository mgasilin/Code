import { ApiProperty } from '@nestjs/swagger';
import { LessonResponseDto } from './lesson-response';

export class LessonsResponseDto {
  @ApiProperty({ type: [LessonResponseDto], description: 'Список занятий' })
  data: LessonResponseDto[];

  @ApiProperty({ example: 100, description: 'Общее количество занятий' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Количество записей на странице' })
  limit: number;
}