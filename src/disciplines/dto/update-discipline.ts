import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsInt, Min, Max, IsArray } from 'class-validator';

export class UpdateDisciplineDto {
  @ApiPropertyOptional({ example: 'Обновленное название', description: 'Название дисциплины' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Обновленное описание', description: 'Описание дисциплины', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 3, description: 'Год обучения (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  year_of_study?: number;

  @ApiPropertyOptional({ example: false, description: 'Флаг активности' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ 
    example: [1, 2, 4], 
    description: 'Массив ID направлений подготовки, к которым привязана дисциплина',
    type: [Number]
  })
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  course_ids?: number[];
}