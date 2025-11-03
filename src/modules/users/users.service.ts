import { UserRepository } from '../../repositories/user.repository';
import { PlatoonRepository } from '../../repositories/platoon.repository';

export class UsersService {
  private userRepository: UserRepository;
  private platoonRepository: PlatoonRepository;

  constructor() {
    this.userRepository = new UserRepository();
    this.platoonRepository = new PlatoonRepository();
  }

  async findById(id: number) {
    return this.userRepository.findById(id, {
      relations: ['platoon']
    });
  }

  async findAll(filters: any) {
    const page = parseInt(filters.page) || 1;
    const limit = parseInt(filters.limit) || 10;
    const search = filters.search;

    if (search) {
      return this.userRepository.searchUsers(search, page, limit);
    }

    const [users, total] = await this.userRepository.findAndCount({
      where: { isActive: true },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['platoon']
    });

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async getPlatoons() {
    return this.platoonRepository.findActivePlatoons();
  }

  async createUser(userData: any) {
    const user = await this.userRepository.create(userData);
    
    if (userData.password) {
      await user.setPassword(userData.password);
      await this.userRepository.save(user);
    }
    
    return user;
  }

  async updateUser(id: number, userData: any) {
    return this.userRepository.update(id, userData);
  }
}