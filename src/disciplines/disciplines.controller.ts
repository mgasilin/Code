import { Controller, Get, Post, Put, Delete, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DisciplinesService } from './disciplines.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { UserRole } from '../entities/user.entity';
import { DisciplinesQueryDto } from './dto/disciplines-query';
import { DisciplinesResponseDto } from './dto/disciplines-response';
import { DisciplineResponseDto } from './dto/discipline-response';
import { CreateDisciplineDto } from './dto/create-discipline';
import { UpdateDisciplineDto } from './dto/update-discipline';
import { LessonsResponseDto } from '../lessons/dto/lessons-response';
import { LessonType } from '../entities/lesson.entity';
import { AddCourseToDisciplineDto } from './dto/add-course-to-discipline.dto';

@ApiTags('Disciplines')
@ApiBearerAuth('BearerAuth')
@Controller('disciplines')
@UseGuards(JwtAuthGuard)
export class DisciplinesController {
  constructor(private readonly disciplinesService: DisciplinesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список дисциплин' })
  @ApiResponse({ status: 200, type: DisciplinesResponseDto, description: 'Список дисциплин' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(@Query() query: DisciplinesQueryDto): Promise<DisciplinesResponseDto> {
    return this.disciplinesService.findAll({
      page: query.page,
      limit: query.limit,
      courseId: query.course_id,
      yearOfStudy: query.year_of_study,
      isActive: query.is_active,
    });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Создать дисциплину с привязкой к направлениям подготовки' })
  @ApiResponse({ status: 201, type: DisciplineResponseDto, description: 'Дисциплина успешно создана' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Одно или несколько направлений подготовки не найдены' })
  async create(
    @Body() createDisciplineDto: CreateDisciplineDto,
    @AuthUser() currentUser: any
  ): Promise<DisciplineResponseDto> {
    return this.disciplinesService.create(createDisciplineDto, currentUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить дисциплину по ID' })
  @ApiResponse({ status: 200, type: DisciplineResponseDto, description: 'Дисциплина' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Дисциплина не найдена' })
  async findOne(@Param('id') id: number): Promise<DisciplineResponseDto> {
    return this.disciplinesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить дисциплину' })
  @ApiResponse({ status: 200, type: DisciplineResponseDto, description: 'Дисциплина успешно обновлена' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Дисциплина не найдена' })
  async update(
    @Param('id') id: number,
    @Body() updateDisciplineDto: UpdateDisciplineDto
  ): Promise<DisciplineResponseDto> {
    return this.disciplinesService.update(id, updateDisciplineDto);
  }

  @Get(':id/lessons')
  @ApiOperation({ summary: 'Получить занятия по дисциплине' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'lesson_type', required: false, enum: LessonType, description: 'Фильтр по типу занятия' })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean, example: true })
  @ApiResponse({ status: 200, type: LessonsResponseDto, description: 'Список занятий дисциплины' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Дисциплина не найдена' })
  async getLessonsByDiscipline(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('lesson_type') lessonType?: LessonType,
    @Query('is_active') isActive: boolean = true,
  ): Promise<LessonsResponseDto> {
    return this.disciplinesService.getLessonsByDiscipline(
      id,
      Math.max(1, page),
      Math.min(Math.max(1, limit), 100),
      lessonType,
      isActive,
    );
  }

  @Post(':id/courses')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Добавить направление подготовки к дисциплине' })
  @ApiResponse({ status: 201, description: 'Направление успешно добавлено к дисциплине' })
  @ApiResponse({ status: 400, description: 'Дисциплина уже привязана к этому направлению' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Дисциплина или направление не найдены' })
  async addCourseToDiscipline(
    @Param('id') id: number,
    @Body() dto: AddCourseToDisciplineDto,
  ): Promise<void> {
    return this.disciplinesService.addCourseToDiscipline(id, dto.course_id);
  }

  @Delete(':disciplineId/courses/:courseId')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Удалить направление подготовки из дисциплины' })
  @ApiResponse({ status: 200, description: 'Направление успешно удалено из дисциплины' })
  @ApiResponse({ status: 400, description: 'Дисциплина должна быть привязана хотя бы к одному направлению' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Связь между дисциплиной и направлением не найдена' })
  async removeCourseFromDiscipline(
    @Param('disciplineId') disciplineId: number,
    @Param('courseId') courseId: number,
  ): Promise<void> {
    return this.disciplinesService.removeCourseFromDiscipline(disciplineId, courseId);
  }
}