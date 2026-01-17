import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';

export class UpdateDisciplineDto {
  @ApiPropertyOptional({ example: 'Обновленное название', description: 'Название дисциплины' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Обновленное описание', description: 'Описание дисциплины', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3, description: 'Год обучения (1-3)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  year_of_study?: number;

  @ApiPropertyOptional({ example: false, description: 'Флаг активности' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}