import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { UserRole } from '../entities/user.entity';
import { UsersQueryDto } from './dto/users-query';
import { UsersResponseDto } from './dto/users-response';
import { UserResponseDto } from './dto/user-response';

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
  @ApiResponse({ status: 200, type: UsersResponseDto, description: 'Список пользователей' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Требуется роль teacher' })
  async findAll(@Query() query: UsersQueryDto): Promise<UsersResponseDto> {
    return this.usersService.findAll({
      page: query.page,
      limit: query.limit,
      role: query.role,
      platoonId: query.platoon_id,
      isActive: query.is_active, 
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить информацию о пользователе' })
  @ApiResponse({ status: 200, type: UserResponseDto, description: 'Информация о пользователе' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен. Можно просматривать только свой профиль' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async findOne(@Param('id') id: number, @AuthUser() currentUser: any): Promise<UserResponseDto> {
    if (currentUser.id !== id && currentUser.role !== UserRole.TEACHER) {
      throw new Error('Доступ запрещен. Можно просматривать только свой профиль');
    }

    return this.usersService.findOne(id);
  }
}