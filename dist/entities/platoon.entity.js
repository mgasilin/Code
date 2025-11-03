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
exports.Platoon = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let Platoon = class Platoon {
};
exports.Platoon = Platoon;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Platoon.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'year_of_study' }),
    __metadata("design:type", Number)
], Platoon.prototype, "yearOfStudy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Platoon.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Platoon.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', default: true }),
    __metadata("design:type", Boolean)
], Platoon.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, user => user.platoon),
    __metadata("design:type", Array)
], Platoon.prototype, "users", void 0);
exports.Platoon = Platoon = __decorate([
    (0, typeorm_1.Entity)('platoons')
], Platoon);
//# sourceMappingURL=platoon.entity.js.map