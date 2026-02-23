import { 
  Controller, Post, Get, Put, Delete, Param, Body, 
  UseGuards, UseInterceptors, UploadedFiles, UploadedFile,
  Res, HttpStatus
} from '@nestjs/common';
import { 
  ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, 
  ApiConsumes, ApiBody 
} from '@nestjs/swagger';
import { Response } from 'express';
import { FilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { MaterialAttachmentsService } from './/material-attachments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { UserRole } from '../entities/user.entity';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { AttachmentResponseDto } from './dto/attachment-response.dto';

@ApiTags('Attachments')
@ApiBearerAuth('BearerAuth')
@Controller()
@UseGuards(JwtAuthGuard)
export class AttachmentsController {
  constructor(private readonly attachmentsService: MaterialAttachmentsService) {}

  @Post('lessons/:lessonId/attachments')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @UseInterceptors(FilesInterceptor('files', 10))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить файлы для занятия' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @ApiResponse({ status: 201, type: [AttachmentResponseDto] })
  async uploadFiles(
    @Param('lessonId') lessonId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @AuthUser() user: any,
  ): Promise<AttachmentResponseDto[]> {
    return this.attachmentsService.createMultiple(lessonId, files, user.id);
  }

  @Post('lessons/:lessonId/attachments/single')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Загрузить один файл для занятия' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiResponse({ status: 201, type: AttachmentResponseDto })
  async uploadSingleFile(
    @Param('lessonId') lessonId: number,
    @UploadedFile() file: Express.Multer.File,
    @AuthUser() user: any,
  ): Promise<AttachmentResponseDto> {
    return this.attachmentsService.create(lessonId, file, user.id);
  }

  @Get('lessons/:lessonId/attachments')
  @ApiOperation({ summary: 'Получить все файлы занятия' })
  @ApiResponse({ status: 200, type: [AttachmentResponseDto] })
  async findAllByLesson(@Param('lessonId') lessonId: number): Promise<AttachmentResponseDto[]> {
    return this.attachmentsService.findByLesson(lessonId);
  }

  @Get('attachments/:id')
  @ApiOperation({ summary: 'Получить информацию о файле' })
  @ApiResponse({ status: 200, type: AttachmentResponseDto })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async findOne(@Param('id') id: number): Promise<AttachmentResponseDto> {
    const attachment = await this.attachmentsService.findOne(id);
    return this.attachmentsService['toResponseDto'](attachment);
  }

  @Get('attachments/:id/download')
  @ApiOperation({ summary: 'Скачать файл' })
  @ApiResponse({ status: 200, description: 'Файл' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async download(@Param('id') id: number, @Res() res: Response): Promise<void> {
    const file = await this.attachmentsService.getFile(id);
    
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(file.fileName)}`);
    res.setHeader('Content-Length', file.buffer.length);
    
    res.status(HttpStatus.OK).send(file.buffer);
  }

  @Put('attachments/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить метаданные файла' })
  @ApiResponse({ status: 200, type: AttachmentResponseDto })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async updateMetadata(
    @Param('id') id: number,
    @Body() dto: UpdateAttachmentDto,
  ): Promise<AttachmentResponseDto> {
    return this.attachmentsService.updateMetadata(id, dto);
  }

  @Delete('attachments/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Удалить файл' })
  @ApiResponse({ status: 200, description: 'Файл удален' })
  @ApiResponse({ status: 404, description: 'Файл не найден' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.attachmentsService.remove(id);
  }
}