import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User, UserRole } from '../entities/user.entity';

@ApiTags('Users')
@ApiBearerAuth('BearerAuth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.TEACHER)
  @ApiOperation({ summary: 'Получить список пользователей' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'role', required: false, enum: UserRole })
  @ApiQuery({ name: 'platoon_id', required: false, type: String })
  @ApiQuery({ name: 'is_active', required: false, type: Boolean })
  @ApiResponse({ status: 200, description: 'Список пользователей' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('role') role?: UserRole,
    @Query('platoon_id') platoonId?: string,
    @Query('is_active') isActive?: boolean,
  ) {
    return this.usersService.findAll({
      page: Math.max(1, page),
      limit: Math.min(Math.max(1, limit), 100),
      role,
      platoonId,
      isActive,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию о пользователе' })
  @ApiResponse({ status: 200, description: 'Информация о пользователе' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Можно просматривать только свой профиль' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id') id: number, @AuthUser() currentUser: any) {
    // Проверяем, что пользователь запрашивает свой профиль или имеет роль преподавателя
    if (currentUser.id !== id && currentUser.role !== UserRole.TEACHER) {
      throw new Error('Доступ запрещен. Можно просматривать только свой профиль');
    }

    return this.usersService.findOne(id);
  }
}