import { Injectable, BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import { randomUUID } from 'crypto';
import { IFileMetadata, IFileStorage } from '../interfaces/file-storage.interface';

@Injectable()
export class FileStorageService implements IFileStorage {
  private readonly uploadDir = 'uploads/attachments';
  private readonly maxFileSize = 30 * 1024 * 1024;

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async save(file: Express.Multer.File): Promise<IFileMetadata> {
    if (file.size > this.maxFileSize) {
      throw new BadRequestException(`Файл ${file.originalname} превышает максимальный размер 30MB`);
    }

    const extension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${extension}`;
    const filePath = path.join(this.uploadDir, fileName);

    await fs.writeFile(filePath, file.buffer);

    return {
      originalName: file.originalname,
      fileName,
      filePath,
      mimeType: file.mimetype,
      size: file.size,
      extension: extension.slice(1),
    };
  }

  async get(filePath: string): Promise<Buffer> {
    return fs.readFile(filePath);
  }

  async delete(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error(`Ошибка удаления файла ${filePath}:`, error);
    }
  }
}