import { ApiProperty } from '@nestjs/swagger';

export class CourseResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор курса' })
  id: number;

  @ApiProperty({ example: 'Программная инженерия', description: 'Название курса' })
  name: string;

  @ApiProperty({ example: 'Подготовка программистов', description: 'Описание курса' })
  description: string;

  @ApiProperty({ example: true, description: 'Флаг активности' })
  is_active: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  created_at: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата обновления' })
  updated_at: Date;
}