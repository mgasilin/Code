import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsBoolean, IsString } from 'class-validator';

export class UpdatePlatoonDto {
  @ApiPropertyOptional({ example: 2, description: 'Курс обучения (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  year_of_study?: number;

  @ApiPropertyOptional({ example: 'Обновленное описание', description: 'Описание взвода', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Флаг активности' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ example: 1, description: 'ID направления подготовки', nullable: true })
  @IsOptional()
  @IsInt()
  course_id?: number;
}