import { Router } from 'express';
import { UsersController } from '../modules/users/users.controller';

const router = Router();
const usersController = new UsersController();

router.get('/profile', (req, res) => usersController.getProfile(req, res));
router.get('/list', (req, res) => usersController.getUsersList(req, res));
router.get('/platoons', (req, res) => usersController.getPlatoons(req, res));
router.post('/create', (req, res) => usersController.createUser(req, res));
router.get('/teacher-dashboard', (req, res) => usersController.teacherDashboard(req, res));
router.get('/student-dashboard', (req, res) => usersController.studentDashboard(req, res));
router.get('/common-data', (req, res) => usersController.commonData(req, res));

export default router;