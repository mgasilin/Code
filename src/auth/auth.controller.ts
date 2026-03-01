import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiResponse({ status: 201, description: 'Успешная регистрация' })
  @ApiResponse({ status: 400, description: 'Ошибка валидации' })
  @ApiResponse({ status: 409, description: 'Пользователь уже существует' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

@Public()
@Post('login')
@HttpCode(HttpStatus.OK)
@ApiOperation({ summary: 'Универсальный вход (student или admin)' })
@ApiBody({
  description: 'Учетные данные для входа',
  schema: {
    oneOf: [
      {
        type: 'object',
        required: ['auth_type', 'last_name', 'initials'],
        properties: {
          auth_type: { type: 'string', enum: ['student'], example: 'student' },
          last_name: { type: 'string', example: 'Иванов' },
          initials: { type: 'string', example: 'ИИ' },
          password: { type: 'string', example: 'password123' },
        },
      },
      {
        type: 'object',
        required: ['auth_type', 'last_name', 'password'],
        properties: {
          auth_type: { type: 'string', enum: ['admin'], example: 'admin' },
          last_name: { type: 'string', example: 'Петров' },
          password: { type: 'string', example: 'admin123' },
        },
      },
    ],
  },
})
@ApiResponse({ status: 200, description: 'Успешный вход' })
@ApiResponse({ status: 401, description: 'Неверные учетные данные' })
async login(@Body() loginDto: LoginDto) {
  return this.authService.login(loginDto);
}

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление access токена' })
  @ApiResponse({ status: 200, description: 'Новый access токен' })
  @ApiResponse({ status: 401, description: 'Недействительный refresh токен' })
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Выход из системы' })
  @ApiResponse({ status: 200, description: 'Успешный выход' })
  @ApiResponse({ status: 401, description: 'Не авторизован' })
  async logout(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.logout(refreshTokenDto.refresh_token);
  }
}