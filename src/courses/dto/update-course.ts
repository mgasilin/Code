import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateCourseDto {
  @ApiPropertyOptional({ example: 'Обновленное название', description: 'Название курса' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 'Обновленное описание', description: 'Описание курса', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: false, description: 'Флаг активности' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}