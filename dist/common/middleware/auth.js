"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_repository_1 = require("../repositories/user.repository");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({
            success: false,
            error: 'Access token required'
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const userRepository = new user_repository_1.UserRepository();
        const user = await userRepository.findById(decoded.userId, {
            relations: ['platoon']
        });
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                error: 'User not found or inactive'
            });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map