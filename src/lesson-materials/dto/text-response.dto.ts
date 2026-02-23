import { ApiProperty } from '@nestjs/swagger';

export class TextResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор текста' })
  id: number;

  @ApiProperty({ example: 5, description: 'ID занятия' })
  lesson_id: number;

  @ApiProperty({ example: 'Введение', description: 'Заголовок текста' })
  title: string;

  @ApiProperty({ example: 'Полный текст лекции...', description: 'Содержание текста' })
  content: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер для сортировки' })
  order_number: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата создания' })
  created_at: Date;
}