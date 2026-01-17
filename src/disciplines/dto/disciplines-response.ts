import { ApiProperty } from '@nestjs/swagger';
import { DisciplineResponseDto } from './discipline-response';

export class DisciplinesResponseDto {
  @ApiProperty({ type: [DisciplineResponseDto], description: 'Список дисциплин' })
  data: DisciplineResponseDto[];

  @ApiProperty({ example: 50, description: 'Общее количество дисциплин' })
  total: number;

  @ApiProperty({ example: 1, description: 'Текущая страница' })
  page: number;

  @ApiProperty({ example: 20, description: 'Количество записей на странице' })
  limit: number;
}