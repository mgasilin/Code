// modules/lesson-materials/dto/create-attachment.dto.ts
import { ApiProperty, ApiPropertyOptional} from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateAttachmentDto {
  @ApiProperty({ type: 'string', format: 'binary', description: 'Файл для загрузки' })
  file: any;

  @ApiPropertyOptional({ example: 'Презентация к лекции', description: 'Описание файла' })
  @IsOptional()
  @IsString()
  description?: string;
}