"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../modules/auth/auth.controller");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refreshToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/profile', (req, res) => authController.getProfile(req, res));
exports.default = router;
//# sourceMappingURL=auth.routes.js.map