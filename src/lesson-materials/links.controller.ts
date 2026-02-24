import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MaterialLinksService } from './material-links.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateLinkDto } from './dto/create-link.dto';
import { UpdateLinkDto } from './dto/update-link.dto';
import { LinkResponseDto } from './dto/link-response.dto';

@ApiTags('Links')
@ApiBearerAuth('BearerAuth')
@Controller()
@UseGuards(JwtAuthGuard)
export class LinksController {
  constructor(private readonly linksService: MaterialLinksService) {}

  @Post('lessons/:lessonId/links')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Создать ссылку для занятия' })
  @ApiResponse({ status: 201, type: LinkResponseDto })
  @ApiResponse({ status: 404, description: 'Занятие не найдено' })
  async create(
    @Param('lessonId') lessonId: number,
    @Body() dto: CreateLinkDto,
  ): Promise<LinkResponseDto> {
    return this.linksService.create(lessonId, dto);
  }

  @Get('lessons/:lessonId/links')
  @ApiOperation({ summary: 'Получить все ссылки занятия' })
  @ApiResponse({ status: 200, type: [LinkResponseDto] })
  async findAllByLesson(@Param('lessonId') lessonId: number): Promise<LinkResponseDto[]> {
    return this.linksService.findByLesson(lessonId);
  }

  @Get('links/:id')
  @ApiOperation({ summary: 'Получить ссылку по ID' })
  @ApiResponse({ status: 200, type: LinkResponseDto })
  @ApiResponse({ status: 404, description: 'Ссылка не найдена' })
  async findOne(@Param('id') id: number): Promise<LinkResponseDto> {
    return this.linksService.findOne(id);
  }

  @Put('links/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить ссылку' })
  @ApiResponse({ status: 200, type: LinkResponseDto })
  @ApiResponse({ status: 404, description: 'Ссылка не найдена' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateLinkDto,
  ): Promise<LinkResponseDto> {
    return this.linksService.update(id, dto);
  }

  @Delete('links/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Удалить ссылку' })
  @ApiResponse({ status: 200, description: 'Ссылка удалена' })
  @ApiResponse({ status: 404, description: 'Ссылка не найдена' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.linksService.remove(id);
  }
}