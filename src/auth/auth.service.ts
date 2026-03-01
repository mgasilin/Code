import { Injectable, UnauthorizedException, ConflictException, BadRequestException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthType } from './dto/login.dto';
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

    const existingUser = await this.usersRepository.findOne({
      where: [{ phoneNumber: phone_number }],
    });

    if (existingUser) {
      throw new ConflictException('Пользователь уже существует');
    }

    const passwordHash = await bcrypt.hash(password, this.bcryptRounds);

    const user = this.usersRepository.create({
      phoneNumber: phone_number,
      passwordHash,
      firstName: first_name,
      lastName: last_name,
      platoonId: platoon_id,
      ...userData,
    });

    const savedUser = await this.usersRepository.save(user);

    const tokens = await this.generateTokens(savedUser);

    return {
      user: this.excludePassword(savedUser),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    let user: User;

    if (loginDto.auth_type === AuthType.STUDENT) {
      user = await this.validateStudentUser(
        loginDto.last_name,
        loginDto.initials
      );
    } else if (loginDto.auth_type === AuthType.ADMIN) {
      user = await this.validateAdminUser(
        loginDto.last_name,
        loginDto.password
      );
    } else {
      throw new BadRequestException('Не указан тип авторизации');
    }

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    const tokens = await this.generateTokens(user);

    return {
      user: this.excludePassword(user),
      ...tokens,
    };
  }

  private async validateStudentUser(lastName: string, initials: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        lastName,
        initials,
        role: UserRole.STUDENT,
        isActive: true
      },
    });

    if (user) {
      return user;
    }

    return null;
  }

  private async validateAdminUser(lastName: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: {
        lastName,
        role: UserRole.ADMIN,
        isActive: true
      },
    });

    if (user && user.passwordHash && await bcrypt.compare(password, user.passwordHash)) {
      return user;
    }

    return null;
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