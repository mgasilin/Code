import { FindOneOptions, FindManyOptions, Like } from 'typeorm';
import { BaseRepository } from './base.repository';
import { User } from '../entities/user.entity';

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super(User);
  }

  async findByPhoneNumber(phoneNumber: string, options?: FindOneOptions<User>): Promise<User | null> {
    return this.repository.findOne({
      where: { phoneNumber, isActive: true },
      ...options
    });
  }

  async findByLdapUid(ldapUid: string, options?: FindOneOptions<User>): Promise<User | null> {
    return this.repository.findOne({
      where: { ldapUid, isActive: true },
      ...options
    });
  }

  async findActiveUsers(options?: FindManyOptions<User>): Promise<User[]> {
    return this.repository.find({
      where: { isActive: true },
      ...options
    });
  }

  async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.repository.findAndCount({
      where: [
        { firstName: Like(`%${query}%`), isActive: true },
        { lastName: Like(`%${query}%`), isActive: true },
        { email: Like(`%${query}%`), isActive: true }
      ],
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });

    return { users, total };
  }

  async updateLastLogin(userId: number): Promise<void> {
    await this.repository.update(userId, { lastLoginAt: new Date() });
  }
}