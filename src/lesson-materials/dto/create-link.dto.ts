import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsUrl, IsString, IsOptional, MaxLength } from 'class-validator';
import { LinkType } from '../../entities/material-link.entity';

export class CreateLinkDto {
  @ApiProperty({ 
    enum: LinkType, 
    example: LinkType.EXTERNAL,
    description: 'Тип ссылки: internal_library (библиотека ВУЦ), external (внешний ресурс), test_module (модуль тестирования)'
  })
  @IsEnum(LinkType)
  link_type: LinkType;

  @ApiProperty({ example: 'https://youtube.com/watch?v=123', description: 'URL ссылки на ресурс' })
  @IsUrl()
  @MaxLength(1000)
  url: string;

  @ApiPropertyOptional({ example: 'Видео-лекция по теме', description: 'Заголовок ссылки для отображения' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ example: 'Подробное объяснение с примерами', description: 'Описание ресурса' })
  @IsOptional()
  @IsString()
  description?: string;
}