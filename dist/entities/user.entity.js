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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const platoon_entity_1 = require("./platoon.entity");
const refresh_token_entity_1 = require("./refresh-token.entity");
let User = class User {
    async checkPassword(password) {
        if (!this.passwordHash)
            return false;
        const bcrypt = require('bcryptjs');
        return bcrypt.compare(password, this.passwordHash);
    }
    async setPassword(password) {
        const bcrypt = require('bcryptjs');
        const rounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        this.passwordHash = await bcrypt.hash(password, rounds);
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ldap_uid', nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "ldapUid", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone_number', nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'first_name' }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_name' }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "patronymic", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'platoon_id', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "platoonId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => platoon_entity_1.Platoon, platoon => platoon.users),
    (0, typeorm_1.JoinColumn)({ name: 'platoon_id' }),
    __metadata("design:type", platoon_entity_1.Platoon)
], User.prototype, "platoon", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], User.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        enum: ['student', 'teacher']
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => refresh_token_entity_1.RefreshToken, refreshToken => refreshToken.user),
    __metadata("design:type", Array)
], User.prototype, "refreshTokens", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map