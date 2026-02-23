import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialLink } from '../entities/material-link.entity';
import { Lesson } from '../entities/lesson.entity';
import { MaterialText } from '../entities/material-text.entity';
import { MaterialAttachment } from '../entities/material-attachment.entity';
import { FileStorageService } from '../services/file-storage.service';
import { MaterialLinksService } from './material-links.service';
import { MaterialAttachmentsService } from './material-attachments.service';
import { MaterialTextsService } from './material-texts.service';
import { LinksController } from './links.controller';
import { TextsController } from './texts.controller';
import { AttachmentsController } from './attachments.controller';


@Module({
  imports: [
    TypeOrmModule.forFeature([MaterialLink, MaterialText, MaterialAttachment, Lesson]),
  ],
  providers: [
    FileStorageService,
    MaterialTextsService,
    MaterialLinksService,
    MaterialAttachmentsService,
  ],
  controllers: [
    LinksController,
    TextsController,
    AttachmentsController,
  ],
  exports: [
    FileStorageService,
    MaterialTextsService,
    MaterialLinksService,
    MaterialAttachmentsService,
  ],
})
export class LessonMaterialsModule {}