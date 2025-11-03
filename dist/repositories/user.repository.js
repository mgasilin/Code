"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const typeorm_1 = require("typeorm");
const base_repository_1 = require("./base.repository");
const user_entity_1 = require("../entities/user.entity");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(user_entity_1.User);
    }
    async findByPhoneNumber(phoneNumber, options) {
        return this.repository.findOne({
            where: { phoneNumber, isActive: true },
            ...options
        });
    }
    async findByLdapUid(ldapUid, options) {
        return this.repository.findOne({
            where: { ldapUid, isActive: true },
            ...options
        });
    }
    async findActiveUsers(options) {
        return this.repository.find({
            where: { isActive: true },
            ...options
        });
    }
    async searchUsers(query, page = 1, limit = 10) {
        const [users, total] = await this.repository.findAndCount({
            where: [
                { firstName: (0, typeorm_1.Like)(`%${query}%`), isActive: true },
                { lastName: (0, typeorm_1.Like)(`%${query}%`), isActive: true },
                { email: (0, typeorm_1.Like)(`%${query}%`), isActive: true }
            ],
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' }
        });
        return { users, total };
    }
    async updateLastLogin(userId) {
        await this.repository.update(userId, { lastLoginAt: new Date() });
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map