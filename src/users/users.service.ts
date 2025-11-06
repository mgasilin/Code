import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Like } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

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

  async findAll(options: FindAllOptions) {
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

    // Исключаем passwordHash из ответа
    const usersWithoutPassword = users.map(user => {
      const { passwordHash, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      data: usersWithoutPassword,
      total,
      page,
      limit,
      total_pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<Partial<User>> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['platoon'],
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Исключаем passwordHash из ответа
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
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
}