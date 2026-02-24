import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAttachmentDto {
  @ApiPropertyOptional({ example: 'Обновленное описание', description: 'Описание файла' })
  @IsOptional()
  @IsString()
  description?: string;
}