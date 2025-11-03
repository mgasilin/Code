"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../../repositories/user.repository");
const refresh_token_repository_1 = require("../../repositories/refresh-token.repository");
class AuthService {
    constructor() {
        this.userRepository = new user_repository_1.UserRepository();
        this.refreshTokenRepository = new refresh_token_repository_1.RefreshTokenRepository();
    }
    async validateUser(phoneNumber, password) {
        const user = await this.userRepository.findByPhoneNumber(phoneNumber);
        if (user && await user.checkPassword(password)) {
            return user;
        }
        return null;
    }
    async updateLastLogin(userId) {
        await this.userRepository.updateLastLogin(userId);
    }
    generateTokens(user) {
        const payload = {
            userId: user.id,
            role: user.role,
            phoneNumber: user.phoneNumber,
            ldapUid: user.ldapUid
        };
        const accessToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });
        const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN
        });
        return { accessToken, refreshToken };
    }
    async saveRefreshToken(userId, refreshToken) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await this.refreshTokenRepository.create({
            userId,
            token: refreshToken,
            expiresAt
        });
    }
    async validateRefreshToken(refreshToken) {
        const token = await this.refreshTokenRepository.findValidToken(refreshToken);
        if (!token) {
            return null;
        }
        return this.userRepository.findById(token.userId);
    }
    async revokeRefreshToken(token) {
        await this.refreshTokenRepository.revokeToken(token);
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map