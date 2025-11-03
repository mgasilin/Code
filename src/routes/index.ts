import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './users.routes';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Проверка здоровья API
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API работает нормально
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: "development"
 */
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;