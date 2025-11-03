"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseController = void 0;
class BaseController {
    getUser(req) {
        return req.user;
    }
    successResponse(data, message) {
        return {
            success: true,
            data,
            message
        };
    }
    errorResponse(error) {
        return {
            success: false,
            error
        };
    }
    paginatedResponse(data, pagination) {
        return {
            success: true,
            data: {
                items: data,
                pagination
            }
        };
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=controller.js.map