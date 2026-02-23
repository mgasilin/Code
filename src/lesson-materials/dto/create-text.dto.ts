import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsInt, Min, Max } from 'class-validator';

export class CreateTextDto {
  @ApiProperty({ example: 'Введение', description: 'Заголовок текстового материала' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Полный текст лекции...', description: 'Содержание текстового материала' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: 1, description: 'Порядковый номер для сортировки' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(999)
  order_number?: number;
}