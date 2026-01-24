import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { UserRole } from '../entities/user.entity';
import { CoursesQueryDto } from './dto/courses-query';
import { CoursesResponseDto } from './dto/courses-response';
import { CourseResponseDto } from './dto/course-response';
import { CreateCourseDto } from './dto/create-course';
import { UpdateCourseDto } from './dto/update-course';
import { DisciplinesResponseDto } from '../disciplines/dto/disciplines-response';


@ApiTags('Courses')
@ApiBearerAuth('BearerAuth')
@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список направлений подготовки' })
  @ApiResponse({ status: 200, type: CoursesResponseDto, description: 'Список направлений' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(@Query() query: CoursesQueryDto): Promise<CoursesResponseDto> {
    return this.coursesService.findAll({
      page: query.page,
      limit: query.limit,
      isActive: query.is_active,
    });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Создать направление подготовки' })
  @ApiResponse({ status: 201, type: CourseResponseDto, description: 'Направление успешно создано' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @AuthUser() currentUser: any
  ): Promise<CourseResponseDto> {
    return this.coursesService.create(createCourseDto, currentUser.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить направление подготовки по ID' })
  @ApiResponse({ status: 200, type: CourseResponseDto, description: 'Направление подготовки' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Направление не найдено' })
  async findOne(@Param('id') id: number): Promise<CourseResponseDto> {
    return this.coursesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить направление подготовки' })
  @ApiResponse({ status: 200, type: CourseResponseDto, description: 'Направление успешно обновлено' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Направление не найдено' })
  async update(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto
  ): Promise<CourseResponseDto> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Get(':id/disciplines')
  @ApiOperation({ summary: 'Получить дисциплины по направлению подготовки' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean, example: true })
  @ApiResponse({ status: 200, type: DisciplinesResponseDto, description: 'Список дисциплин направления' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 404, description: 'Направление подготовки не найдено' })
  async getDisciplinesByCourse(
    @Param('id') id: number,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('is_active') isActive?: boolean,
  ): Promise<DisciplinesResponseDto> {
    return this.coursesService.getDisciplinesByCourse(
      id,
      Math.max(1, page),
      Math.min(Math.max(1, limit), 100),
      isActive,
    );
  }
}