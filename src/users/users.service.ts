import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';
import { UserResponseDto } from './dto/user-response';
import { UsersResponseDto } from './dto/users-response';

interface FindAllOptions {
  page: number;
  limit: number;
  role?: UserRole;
  platoonId?: string;
  isActive?: boolean;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(options: FindAllOptions): Promise<UsersResponseDto> {
    const { page, limit, role, platoonId, isActive } = options;
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<User> = {};

    if (role) {
      where.role = role;
    }

    if (platoonId) {
      where.platoonId = platoonId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [users, total] = await this.usersRepository.findAndCount({
      where,
      relations: ['platoon'],
      skip,
      take: limit,
      order: { id: 'ASC' },
    });

    const usersDto = users.map(user => this.toUserResponseDto(user));

    return {
      data: usersDto,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<UserResponseDto> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['platoon'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return this.toUserResponseDto(user);
  }

  async findByPhone(phoneNumber: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { phoneNumber },
    });
  }

  async findByLdapUid(ldapUid: string): Promise<User> {
    return this.usersRepository.findOne({
      where: { ldapUid },
    });
  }

  private toUserResponseDto(user: User): UserResponseDto {
    return {
      id: user.id,
      ldap_uid: user.ldapUid,
      phone_number: user.phoneNumber,
      first_name: user.firstName,
      last_name: user.lastName,
      patronymic: user.patronymic,
      email: user.email,
      role: user.role,
      platoon: user.platoon ? {
        id: user.platoon.id,
        year_of_study: user.platoon.yearOfStudy,
        description: user.platoon.description,
        is_active: user.platoon.isActive,
        created_at: user.platoon.createdAt,
      } : undefined,
      last_login_at: user.lastLoginAt,
      is_active: user.isActive,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}