import { ApiProperty } from '@nestjs/swagger';
import { CourseResponseDto } from './course-response';

export class CoursesResponseDto {
  @ApiProperty({ type: [CourseResponseDto], description: 'Список курсов' })
  data: CourseResponseDto[];

  @ApiProperty({ example: 25, description: 'Общее количество курсов' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Количество записей на странице' })
  limit: number;
}