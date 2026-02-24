// modules/lesson-materials/services/material-attachments.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialAttachment } from '../entities/material-attachment.entity';
import { Lesson } from '../entities/lesson.entity';
import { FileStorageService } from '../services/file-storage.service';
import { AttachmentResponseDto } from './dto/attachment-response.dto';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';

@Injectable()
export class MaterialAttachmentsService {
  constructor(
    @InjectRepository(MaterialAttachment)
    private attachmentsRepository: Repository<MaterialAttachment>,
    @InjectRepository(Lesson)
    private lessonsRepository: Repository<Lesson>,
    private fileStorageService: FileStorageService,
  ) {}

  async create(
    lessonId: number, 
    file: Express.Multer.File, 
    userId: number
  ): Promise<AttachmentResponseDto> {
    const lesson = await this.lessonsRepository.findOne({ where: { id: lessonId } });
    if (!lesson) {
      throw new NotFoundException(`Занятие с ID ${lessonId} не найдено`);
    }

    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    const fileMetadata = await this.fileStorageService.save(file);

    const attachment = this.attachmentsRepository.create({
      lessonId,
      fileName: fileMetadata.originalName,
      fileType: fileMetadata.mimeType,
      filePath: fileMetadata.filePath,
      fileSize: fileMetadata.size,
      uploadedBy: userId,
    });

    const savedAttachment = await this.attachmentsRepository.save(attachment);
    return this.toResponseDto(savedAttachment);
  }

  async createMultiple(
    lessonId: number,
    files: Express.Multer.File[],
    userId: number
  ): Promise<AttachmentResponseDto[]> {
    if (!files || files.length === 0) {
      throw new BadRequestException('Нет файлов для загрузки');
    }

    const results = await Promise.all(
      files.map(file => this.create(lessonId, file, userId))
    );

    return results;
  }

  async findByLesson(lessonId: number): Promise<AttachmentResponseDto[]> {
    const attachments = await this.attachmentsRepository.find({
      where: { lessonId },
      order: { uploadedAt: 'DESC' },
    });
    return attachments.map(att => this.toResponseDto(att));
  }

  async findOne(id: number): Promise<MaterialAttachment> {
    const attachment = await this.attachmentsRepository.findOne({ 
      where: { id },
      relations: ['uploader'],
    });
    if (!attachment) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }
    return attachment;
  }

  async getFile(id: number): Promise<{ buffer: Buffer; mimeType: string; fileName: string }> {
    const attachment = await this.findOne(id);
    const buffer = await this.fileStorageService.get(attachment.filePath);
    
    return {
      buffer,
      mimeType: attachment.fileType,
      fileName: attachment.fileName,
    };
  }

  async updateMetadata(id: number, dto: UpdateAttachmentDto): Promise<AttachmentResponseDto> {
    const attachment = await this.attachmentsRepository.findOne({ where: { id } });
    if (!attachment) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    return this.toResponseDto(attachment);
  }

  async remove(id: number): Promise<void> {
    const attachment = await this.attachmentsRepository.findOne({ where: { id } });
    if (!attachment) {
      throw new NotFoundException(`Файл с ID ${id} не найден`);
    }

    await this.fileStorageService.delete(attachment.filePath);
    
    await this.attachmentsRepository.delete(id);
  }

  private toResponseDto(attachment: MaterialAttachment): AttachmentResponseDto {
    return {
      id: attachment.id,
      lesson_id: attachment.lessonId,
      file_name: attachment.fileName,
      file_type: attachment.fileType,
      file_size: attachment.fileSize,
      file_url: `/api/attachments/${attachment.id}/download`,
      uploaded_by: attachment.uploadedBy,
      uploaded_at: attachment.uploadedAt,
    };
  }
}