"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../modules/users/users.controller");
const router = (0, express_1.Router)();
const usersController = new users_controller_1.UsersController();
router.get('/profile', (req, res) => usersController.getProfile(req, res));
router.get('/list', (req, res) => usersController.getUsersList(req, res));
router.get('/platoons', (req, res) => usersController.getPlatoons(req, res));
router.post('/create', (req, res) => usersController.createUser(req, res));
router.get('/teacher-dashboard', (req, res) => usersController.teacherDashboard(req, res));
router.get('/student-dashboard', (req, res) => usersController.studentDashboard(req, res));
router.get('/common-data', (req, res) => usersController.commonData(req, res));
exports.default = router;
//# sourceMappingURL=users.routes.js.map