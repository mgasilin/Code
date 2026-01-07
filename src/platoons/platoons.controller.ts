import { Controller, Get, Post, Put, Param, Query, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PlatoonsService } from './platoons.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { PlatoonsQueryDto } from './dto/platoons-query';
import { PlatoonsResponseDto } from './dto/platoons-response';
import { PlatoonResponseDto } from './dto/platoon-response';
import { CreatePlatoonDto } from './dto/create-platoon';
import { UpdatePlatoonDto } from './dto/update-platoon';

@ApiTags('Platoons')
@ApiBearerAuth('BearerAuth')
@Controller('platoons')
@UseGuards(JwtAuthGuard)
export class PlatoonsController {
  constructor(private readonly platoonsService: PlatoonsService) {}

  @Get()
  @ApiOperation({ summary: 'Получить список взводов' })
  @ApiResponse({ status: 200, type: PlatoonsResponseDto, description: 'Список взводов' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async findAll(@Query() query: PlatoonsQueryDto): Promise<PlatoonsResponseDto> {
    return this.platoonsService.findAll({
      page: query.page,
      limit: query.limit,
      yearOfStudy: query.year_of_study,
      isActive: query.is_active,
    });
  }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Создать новый взвод' })
  @ApiResponse({ status: 201, type: PlatoonResponseDto, description: 'Взвод успешно создан' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 409, description: 'Взвод с таким ID уже существует' })
  async create(@Body() createPlatoonDto: CreatePlatoonDto): Promise<PlatoonResponseDto> {
    return this.platoonsService.create(createPlatoonDto);
  }

  @Put(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Обновить взвод' })
  @ApiResponse({ status: 200, type: PlatoonResponseDto, description: 'Взвод успешно обновлен' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  @ApiResponse({ status: 404, description: 'Взвод не найден' })
  async update(
    @Param('id') id: string,
    @Body() updatePlatoonDto: UpdatePlatoonDto,
  ): Promise<PlatoonResponseDto> {
    return this.platoonsService.update(id, updatePlatoonDto);
  }
}