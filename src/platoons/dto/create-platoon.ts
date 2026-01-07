import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsOptional, IsBoolean } from 'class-validator';

export class CreatePlatoonDto {
  @ApiProperty({ example: '101A', description: 'Уникальный идентификатор взвода' })
  @IsString()
  id: string;

  @ApiProperty({ example: 3, description: 'Курс обучения (1-5)' })
  @IsInt()
  @Min(1)
  @Max(5)
  year_of_study: number;

  @ApiPropertyOptional({ example: 'Взвод 2410', description: 'Описание взвода', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 1, description: 'ID направления подготовки', nullable: true })
  @IsOptional()
  @IsInt()
  course_id?: number;
}