import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  private readonly bcryptRounds: number;

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private refreshTokensRepository: Repository<RefreshToken>,
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.bcryptRounds = this.configService.get<number>('bcrypt.rounds') || 12;
  }

  async register(registerDto: RegisterDto) {
    const { phone_number, password, first_name, last_name, platoon_id, ...userData } = registerDto;

    // Проверка существования пользователя
    const existingUser = await this.usersRepository.findOne({
      where: [{ phoneNumber: phone_number }],
    });

    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }

    // Хеширование пароля
    const passwordHash = await bcrypt.hash(password, this.bcryptRounds);

    // Создание пользователя - преобразуем snake_case в camelCase
    const user = this.usersRepository.create({
      phoneNumber: phone_number,
      passwordHash,
      firstName: first_name,
      lastName: last_name,
      platoonId: platoon_id,
      ...userData,
    });

    const savedUser = await this.usersRepository.save(user);

    // Генерация токенов
    const tokens = await this.generateTokens(savedUser);

    return {
      user: this.excludePassword(savedUser),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    let user: User;

    if (loginDto.phone_number) {
      // Аутентификация по телефону
      user = await this.validatePhoneUser(loginDto.phone_number, loginDto.password);
    } else if (loginDto.ldap_username) {
      // Аутентификация через LDAP
      user = await this.validateLdapUser(loginDto.ldap_username, loginDto.ldap_password);
    } else {
      throw new BadRequestException('Не указаны учетные данные');
    }

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    // Обновление времени последнего входа
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    // Генерация токенов
    const tokens = await this.generateTokens(user);

    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    const tokenEntity = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken },
      relations: ['user'],
    });

    if (!tokenEntity || tokenEntity.revokedAt || tokenEntity.expiresAt < new Date()) {
      throw new UnauthorizedException('Недействительный refresh токен');
    }

    const tokens = await this.generateTokens(tokenEntity.user);

    // Отзываем старый refresh токен
    tokenEntity.revokedAt = new Date();
    await this.refreshTokensRepository.save(tokenEntity);

    return tokens;
  }

  async logout(refreshToken: string) {
    const tokenEntity = await this.refreshTokensRepository.findOne({
      where: { token: refreshToken },
    });

    if (tokenEntity) {
      tokenEntity.revokedAt = new Date();
      await this.refreshTokensRepository.save(tokenEntity);
    }

    return { message: 'Successfully logged out' };
  }

  private async validatePhoneUser(phoneNumber: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { phoneNumber, isActive: true },
    });

    if (user && user.passwordHash && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }

    return null;
  }

  private async validateLdapUser(ldapUsername: string, ldapPassword: string): Promise<User> {
    // TODO: Реализовать интеграцию с LDAP
    const user = await this.usersRepository.findOne({
      where: { ldapUid: ldapUsername, isActive: true },
    });

    if (user) {
      // TODO: Реальная проверка через LDAP
      // Пока просто возвращаем пользователя для демонстрации
      return user;
    }

    return null;
  }

  private async generateTokens(user: User) {
    const payload = {
      user_id: user.id,
      identifier: user.ldapUid || user.phoneNumber,
      role: user.role,
      platoon_id: user.platoonId,
      iat: Math.floor(Date.now() / 1000),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn') || '8h',
    });

    const refreshTokenPayload = { ...payload, type: 'refresh' };
    const refreshToken = this.jwtService.sign(refreshTokenPayload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    // Сохраняем refresh токен в БД
    const refreshTokenEntity = this.refreshTokensRepository.create({
      user,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 дней
    });

    await this.refreshTokensRepository.save(refreshTokenEntity);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  private excludePassword(user: User): Partial<User> {
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}