import { Router } from 'express';
import { AuthController } from '../modules/auth/auth.controller';

const router = Router();
const authController = new AuthController();

router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refreshToken(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/profile', (req, res) => authController.getProfile(req, res));

export default router;