import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreateDisciplineDto {
  @ApiProperty({ example: 'Базы данных', description: 'Название дисциплины' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Изучение основ баз данных', description: 'Описание дисциплины', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 2, description: 'Год обучения (1-5)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  year_of_study?: number;

  @ApiProperty({ 
    example: [1, 2, 3], 
    description: 'Массив ID направлений подготовки, к которым привязана дисциплина',
    type: [Number]
  })
  @IsArray()
  @IsInt({ each: true })
  @ArrayMinSize(1)
  course_ids: number[];
}