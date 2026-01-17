import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { LessonType } from '../../entities/lesson.entity';

export class UpdateLessonDto {
  @ApiPropertyOptional({ example: 'Обновленное название', description: 'Название занятия' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 2, description: 'Порядковый номер занятия' })
  @IsOptional()
  @IsInt()
  @Min(1)
  order_number?: number;

  @ApiPropertyOptional({ example: 'Обновленное описание', description: 'Описание занятия', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: LessonType, description: 'Тип занятия' })
  @IsOptional()
  @IsEnum(LessonType)
  lesson_type?: LessonType;

  @ApiPropertyOptional({ example: false, description: 'Флаг активности' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}