import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Программная инженерия', description: 'Название курса' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Подготовка программистов', description: 'Описание курса', nullable: true })
  @IsOptional()
  @IsString()
  description?: string;
}