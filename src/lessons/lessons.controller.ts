import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { UserRole } from '../entities/user.entity';
import { LessonsQueryDto } from './dto/lessons-query';
import { LessonsResponseDto } from './dto/lessons-response';
import { LessonResponseDto } from './dto/lesson-response';
import { CreateLessonDto } from './dto/create-lesson';
import { UpdateLessonDto } from './dto/update-lesson';

@ApiTags('Lessons')
@ApiBearerAuth('BearerAuth')
@Controller('lessons')
@UseGuards(JwtAuthGuard)
export class LessonsController {
  constructor(private readonly lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список занятий' })
  @ApiResponse({ status: 200, type: LessonsResponseDto, description: 'Список занятий' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(@Query() query: LessonsQueryDto): Promise<LessonsResponseDto> {
    return this.lessonsService.findAll({
      page: query.page,
      limit: query.limit,
      disciplineId: query.discipline_id,
      lessonType: query.lesson_type,
      isActive: query.is_active,
    });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Создать занятие' })
  @ApiResponse({ status: 201, type: LessonResponseDto, description: 'Занятие успешно создано' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Дисциплина не найдена' })
  @ApiResponse({ status: 409, description: 'Занятие с таким порядковым номером уже существует в дисциплине' })
  async create(
    @Body() createLessonDto: CreateLessonDto,
    @AuthUser() currentUser: any
  ): Promise<LessonResponseDto> {
    return this.lessonsService.create(createLessonDto, currentUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить занятие по ID' })
  @ApiResponse({ status: 200, type: LessonResponseDto, description: 'Занятие' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Занятие не найдено' })
  async findOne(@Param('id') id: number): Promise<LessonResponseDto> {
    return this.lessonsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить занятие' })
  @ApiResponse({ status: 200, type: LessonResponseDto, description: 'Занятие успешно обновлено' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Занятие не найдено' })
  @ApiResponse({ status: 409, description: 'Занятие с таким порядковым номером уже существует в дисциплине' })
  async update(
    @Param('id') id: number,
    @Body() updateLessonDto: UpdateLessonDto
  ): Promise<LessonResponseDto> {
    return this.lessonsService.update(id, updateLessonDto);
  }
}