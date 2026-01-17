import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, Max, IsOptional } from 'class-validator';

export class CreateDisciplineDto {
  @ApiProperty({ example: 1, description: 'ID курса' })
  @IsInt()
  course_id: number;

  @ApiProperty({ example: 'Базы данных', description: 'Название дисциплины' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Изучение основ баз данных', description: 'Описание дисциплины', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 2, description: 'Год обучения (1-3)' })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3)
  year_of_study?: number;
}