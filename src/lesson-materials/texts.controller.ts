import { Controller, Post, Get, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MaterialTextsService } from './material-texts.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateTextDto } from './dto/create-text.dto';
import { UpdateTextDto } from './dto/update-text.dto';
import { TextResponseDto } from './dto/text-response.dto';

@ApiTags('Texts')
@ApiBearerAuth('BearerAuth')
@Controller()
@UseGuards(JwtAuthGuard)
export class TextsController {
  constructor(private readonly textsService: MaterialTextsService) {}

  @Post('lessons/:lessonId/texts')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Создать текст для занятия' })
  @ApiResponse({ status: 201, type: TextResponseDto })
  @ApiResponse({ status: 404, description: 'Занятие не найдено' })
  async create(
    @Param('lessonId') lessonId: number,
    @Body() dto: CreateTextDto,
  ): Promise<TextResponseDto> {
    return this.textsService.create(lessonId, dto);
  }

  @Get('lessons/:lessonId/texts')
  @ApiOperation({ summary: 'Получить все тексты занятия' })
  @ApiResponse({ status: 200, type: [TextResponseDto] })
  async findAllByLesson(@Param('lessonId') lessonId: number): Promise<TextResponseDto[]> {
    return this.textsService.findByLesson(lessonId);
  }

  @Get('texts/:id')
  @ApiOperation({ summary: 'Получить текст по ID' })
  @ApiResponse({ status: 200, type: TextResponseDto })
  @ApiResponse({ status: 404, description: 'Текст не найден' })
  async findOne(@Param('id') id: number): Promise<TextResponseDto> {
    return this.textsService.findOne(id);
  }

  @Put('texts/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить текст' })
  @ApiResponse({ status: 200, type: TextResponseDto })
  @ApiResponse({ status: 404, description: 'Текст не найден' })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateTextDto,
  ): Promise<TextResponseDto> {
    return this.textsService.update(id, dto);
  }

  @Delete('texts/:id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Удалить текст' })
  @ApiResponse({ status: 200, description: 'Текст удален' })
  @ApiResponse({ status: 404, description: 'Текст не найден' })
  async remove(@Param('id') id: number): Promise<void> {
    return this.textsService.remove(id);
  }
}