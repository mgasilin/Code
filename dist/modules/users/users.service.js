"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const user_repository_1 = require("../../repositories/user.repository");
const platoon_repository_1 = require("../../repositories/platoon.repository");
class UsersService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.platoonRepository = new platoon_repository_1.PlatoonRepository();
    }
    async findById(id) {
        return this.userRepository.findById(id, {
            relations: ['platoon']
        });
    }
    async findAllUsers(page = 1, limit = 10, search) {
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
    async createUser(userData) {
        const user = this.userRepository.create(userData);
        if (userData.password) {
            await user.setPassword(userData.password);
        }
        return this.userRepository.save(user);
    }
    async updateUser(id, userData) {
        return this.userRepository.update(id, userData);
    }
}
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map