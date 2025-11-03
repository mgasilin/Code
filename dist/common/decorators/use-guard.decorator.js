"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseGuard = UseGuard;
const auth_1 = require("../../middleware/auth");
const roles_1 = require("../../middleware/roles");
function UseGuard(guard, ...roles) {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (req, res, next) {
            try {
                await applyGuard(guard, roles, req, res);
                return await originalMethod.call(this, req, res, next);
            }
            catch (error) {
                return;
            }
        };
        return descriptor;
    };
}
function applyGuard(guard, roles, req, res) {
    return new Promise((resolve, reject) => {
        const next = (error) => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        };
        switch (guard) {
            case 'auth':
                (0, auth_1.authMiddleware)(req, res, next);
                break;
            case 'roles':
                (0, roles_1.roleMiddleware)(...roles)(req, res, next);
                break;
            default:
                next();
        }
    });
}
//# sourceMappingURL=use-guard.decorator.js.map