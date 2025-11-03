import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
import { UseGuard } from '../../common/guards/use-guard.decorator';
import { AuthService } from './auth.service';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Аутентификация и авторизация
 */
export class AuthController extends BaseController {
  private authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  protected getUser(req: Request) {
    return (req as any).user;
  }

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Вход в систему
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - phone_number
   *               - password
   *             properties:
   *               phone_number:
   *                 type: string
   *                 example: "+79991234567"
   *               password:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: Успешный вход
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Неверные учетные данные
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { phone_number, password } = req.body;

      const user = await this.authService.validateUser(phone_number, password);
      if (!user) {
        res.status(401).json(this.errorResponse('Invalid credentials'));
        return;
      }

      await this.authService.updateLastLogin(user.id);

      const tokens = this.authService.generateTokens(user);
      await this.authService.saveRefreshToken(user.id, tokens.refreshToken);

      res.json(this.successResponse({
        ...tokens,
        user: {
          id: user.id,
          first_name: user.firstName,
          last_name: user.lastName,
          patronymic: user.patronymic,
          email: user.email,
          role: user.role,
          platoon_id: user.platoonId
        }
      }));
      return;

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json(this.errorResponse('Internal server error'));
      return;
    }
  }

  /**
   * @swagger
   * /auth/refresh:
   *   post:
   *     summary: Обновление access token
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - refresh_token
   *             properties:
   *               refresh_token:
   *                 type: string
   *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   *     responses:
   *       200:
   *         description: Токены обновлены
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     accessToken:
   *                       type: string
   *                     refreshToken:
   *                       type: string
   *       401:
   *         description: Неверный refresh token
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body;

      const user = await this.authService.validateRefreshToken(refresh_token);
      if (!user) {
        res.status(401).json(this.errorResponse('Invalid refresh token'));
        return;
      }

      await this.authService.revokeRefreshToken(refresh_token);

      const tokens = this.authService.generateTokens(user);
      await this.authService.saveRefreshToken(user.id, tokens.refreshToken);

      res.json(this.successResponse(tokens));
      return;

    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json(this.errorResponse('Internal server error'));
      return;
    }
  }

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Выход из системы
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               refresh_token:
   *                 type: string
   *     responses:
   *       200:
   *         description: Успешный выход
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                   example: "Logged out successfully"
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('auth')
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const { refresh_token } = req.body;

      if (refresh_token) {
        await this.authService.revokeRefreshToken(refresh_token);
      }

      res.json(this.successResponse(null, 'Logged out successfully'));
      return;

    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json(this.errorResponse('Internal server error'));
      return;
    }
  }

  /**
   * @swagger
   * /auth/profile:
   *   get:
   *     summary: Получить профиль текущего пользователя
   *     tags: [Auth]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Профиль пользователя
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: object
   *                   properties:
   *                     user:
   *                       $ref: '#/components/schemas/User'
   *       401:
   *         description: Не авторизован
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('auth')
  getProfile(req: Request, res: Response): void {
    const user = this.getUser(req);
    res.json(this.successResponse({
      user: {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
        patronymic: user.patronymic,
        email: user.email,
        role: user.role,
        platoon_id: user.platoonId,
        phone_number: user.phoneNumber
      }
    }));
  }
}