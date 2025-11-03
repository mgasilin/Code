"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const base_controller_1 = require("../../common/base/base.controller");
const use_guard_decorator_1 = require("../../common/guards/use-guard.decorator");
const auth_service_1 = require("./auth.service");
class AuthController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.authService = new auth_service_1.AuthService();
    }
    async login(req, res) {
        try {
            const { phone_number, password } = req.body;
            const user = await this.authService.validateUser(phone_number, password);
            if (!user) {
                return res.status(401).json(this.errorResponse('Invalid credentials'));
            }
            await this.authService.updateLastLogin(user.id);
            const tokens = this.authService.generateTokens(user);
            await this.authService.saveRefreshToken(user.id, tokens.refreshToken);
            res.json(this.successResponse({
                ...tokens,
                user: {
                    id: user.id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    patronymic: user.patronymic,
                    email: user.email,
                    role: user.role,
                    platoon_id: user.platoon_id
                }
            }));
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json(this.errorResponse('Internal server error'));
        }
    }
    async refreshToken(req, res) {
        try {
            const { refresh_token } = req.body;
            const user = await this.authService.validateRefreshToken(refresh_token);
            if (!user) {
                return res.status(401).json(this.errorResponse('Invalid refresh token'));
            }
            await this.authService.revokeRefreshToken(refresh_token);
            const tokens = this.authService.generateTokens(user);
            await this.authService.saveRefreshToken(user.id, tokens.refreshToken);
            res.json(this.successResponse(tokens));
        }
        catch (error) {
            console.error('Refresh token error:', error);
            res.status(500).json(this.errorResponse('Internal server error'));
        }
    }
    async logout(req, res) {
        try {
            const { refresh_token } = req.body;
            if (refresh_token) {
                await this.authService.revokeRefreshToken(refresh_token);
            }
            res.json(this.successResponse(null, 'Logged out successfully'));
        }
        catch (error) {
            console.error('Logout error:', error);
            res.status(500).json(this.errorResponse('Internal server error'));
        }
    }
    getProfile(req, res) {
        const user = this.getUser(req);
        res.json(this.successResponse({
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                patronymic: user.patronymic,
                email: user.email,
                role: user.role,
                platoon_id: user.platoon_id,
                phone_number: user.phone_number
            }
        }));
    }
}
exports.AuthController = AuthController;
__decorate([
    (0, use_guard_decorator_1.UseGuard)('auth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, use_guard_decorator_1.UseGuard)('auth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
//# sourceMappingURL=auth.controller.js.map