"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRepository = void 0;
const base_repository_1 = require("./base.repository");
const refresh_token_entity_1 = require("../entities/refresh-token.entity");
class RefreshTokenRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(refresh_token_entity_1.RefreshToken);
    }
    async findValidToken(token) {
        return this.repository.findOne({
            where: {
                token,
                revokedAt: null,
                expiresAt: new Date()
            },
            relations: ['user']
        });
    }
    async revokeToken(token) {
        await this.repository.update({ token }, { revokedAt: new Date() });
    }
    async revokeAllUserTokens(userId) {
        await this.repository.update({ userId, revokedAt: null }, { revokedAt: new Date() });
    }
    async cleanupExpiredTokens() {
        await this.repository
            .createQueryBuilder()
            .delete()
            .where('expires_at < :now', { now: new Date() })
            .orWhere('revoked_at IS NOT NULL')
            .execute();
    }
}
exports.RefreshTokenRepository = RefreshTokenRepository;
//# sourceMappingURL=refresh-token.repository.js.map