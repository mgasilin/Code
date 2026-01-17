import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsBoolean, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { LessonType } from '../../entities/lesson.entity';

export class LessonsQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Номер страницы', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 20, description: 'Количество записей на странице', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ example: 1, description: 'Фильтр по ID дисциплины' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  discipline_id?: number;

  @ApiPropertyOptional({ enum: LessonType, description: 'Фильтр по типу занятия' })
  @IsOptional()
  @IsEnum(LessonType)
  lesson_type?: LessonType;

  @ApiPropertyOptional({ example: true, description: 'Фильтр по активности', default: true })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  is_active?: boolean = true;
}