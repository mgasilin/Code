import { ApiProperty } from '@nestjs/swagger';

export class AttachmentResponseDto {
  @ApiProperty({ example: 1, description: 'Уникальный идентификатор файла' })
  id: number;

  @ApiProperty({ example: 5, description: 'ID занятия' })
  lesson_id: number;

  @ApiProperty({ example: 'лекция.pdf', description: 'Оригинальное имя файла' })
  file_name: string;

  @ApiProperty({ example: 'application/pdf', description: 'MIME тип файла' })
  file_type: string;

  @ApiProperty({ example: 1048576, description: 'Размер файла в байтах' })
  file_size: number;

  @ApiProperty({ example: '/api/attachments/1/download', description: 'URL для скачивания' })
  file_url: string;

  @ApiProperty({ example: 42, description: 'ID пользователя, загрузившего файл', nullable: true })
  uploaded_by: number;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z', description: 'Дата загрузки' })
  uploaded_at: Date;
}