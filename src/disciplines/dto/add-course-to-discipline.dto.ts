import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AddCourseToDisciplineDto {
  @ApiProperty({ example: 1, description: 'ID направления подготовки' })
  @IsInt()
  course_id: number;
}