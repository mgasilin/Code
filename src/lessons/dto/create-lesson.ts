import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, Min, IsOptional, IsEnum } from 'class-validator';
import { LessonType } from '../../entities/lesson.entity';

export class CreateLessonDto {
  @ApiProperty({ example: 1, description: 'ID дисциплины' })
  @IsInt()
  discipline_id: number;

  @ApiProperty({ example: 'Введение в SQL', description: 'Название занятия' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1, description: 'Порядковый номер занятия' })
  @IsInt()
  @Min(1)
  order_number: number;

  @ApiPropertyOptional({ example: 'Основы SQL запросов', description: 'Описание занятия', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: LessonType, example: LessonType.THEORY, description: 'Тип занятия' })
  @IsEnum(LessonType)
  lesson_type: LessonType;
}