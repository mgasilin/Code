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
exports.UsersController = void 0;
const base_controller_1 = require("../../common/base/base.controller");
const use_guard_decorator_1 = require("../../common/guards/use-guard.decorator");
const users_service_1 = require("./users.service");
class UsersController extends base_controller_1.BaseController {
    constructor() {
        super();
        this.usersService = new users_service_1.UsersService();
    }
    async getProfile(req, res) {
        const user = await this.usersService.findById(this.getUser(req).id);
        res.json(this.successResponse({ user }));
    }
    async getUsersList(req, res) {
        try {
            const result = await this.usersService.findAll(req.query);
            res.json(this.successResponse(result));
        }
        catch (error) {
            console.error('Get users list error:', error);
            res.status(500).json(this.errorResponse('Failed to fetch users list'));
        }
    }
    async getPlatoons(req, res) {
        try {
            const platoons = await this.usersService.getPlatoons();
            res.json(this.successResponse({ platoons }));
        }
        catch (error) {
            console.error('Get platoons error:', error);
            res.status(500).json(this.errorResponse('Failed to fetch platoons'));
        }
    }
    async createUser(req, res) {
        try {
            const user = await this.usersService.createUser(req.body);
            res.json(this.successResponse({ user }, 'User created successfully'));
        }
        catch (error) {
            console.error('Create user error:', error);
            res.status(500).json(this.errorResponse('Failed to create user'));
        }
    }
    teacherDashboard(req, res) {
        const user = this.getUser(req);
        res.json(this.successResponse({
            message: 'Welcome to teacher dashboard',
            user: {
                id: user.id,
                first_name: user.first_name,
                role: user.role
            }
        }));
    }
    studentDashboard(req, res) {
        const user = this.getUser(req);
        res.json(this.successResponse({
            message: 'Welcome to student dashboard',
            user: {
                id: user.id,
                first_name: user.first_name,
                role: user.role,
                platoon_id: user.platoon_id
            }
        }));
    }
    commonData(req, res) {
        const user = this.getUser(req);
        res.json(this.successResponse({
            message: 'This data is available for both students and teachers',
            user_role: user.role
        }));
    }
}
exports.UsersController = UsersController;
__decorate([
    (0, use_guard_decorator_1.UseGuard)('auth'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, use_guard_decorator_1.UseGuard)('roles', 'teacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUsersList", null);
__decorate([
    (0, use_guard_decorator_1.UseGuard)('roles', 'teacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getPlatoons", null);
__decorate([
    (0, use_guard_decorator_1.UseGuard)('roles', 'teacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "createUser", null);
__decorate([
    (0, use_guard_decorator_1.UseGuard)('roles', 'teacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "teacherDashboard", null);
__decorate([
    (0, use_guard_decorator_1.UseGuard)('roles', 'student'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "studentDashboard", null);
__decorate([
    (0, use_guard_decorator_1.UseGuard)('roles', 'student', 'teacher'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "commonData", null);
//# sourceMappingURL=users.controller.js.map