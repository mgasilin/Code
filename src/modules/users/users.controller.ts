import { Request, Response } from 'express';
import { AuthController } from '../auth/auth.controller';
import { UseGuard } from '../../common/guards/use-guard.decorator';
import { UsersService } from './users.service';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Управление пользователями
 */
export class UsersController extends AuthController {
  private usersService: UsersService;

  constructor() {
    super();
    this.usersService = new UsersService();
  }

  /**
   * @swagger
   * /users/profile:
   *   get:
   *     summary: Получить профиль текущего пользователя
   *     tags: [Users]
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
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.usersService.findById(this.getUser(req).id);
      res.json(this.successResponse({ user }));
      return;
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json(this.errorResponse('Failed to fetch profile'));
      return;
    }
  }

  /**
   * @swagger
   * /users/list:
   *   get:
   *     summary: Получить список пользователей (только для преподавателей)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Номер страницы
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10
   *         description: Количество записей на странице
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Поиск по имени, фамилии или email
   *     responses:
   *       200:
   *         description: Список пользователей
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
   *                     users:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/User'
   *                     pagination:
   *                       type: object
   *                       properties:
   *                         page:
   *                           type: integer
   *                         limit:
   *                           type: integer
   *                         total:
   *                           type: integer
   *                         totalPages:
   *                           type: integer
   *       403:
   *         description: Недостаточно прав
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('roles', 'teacher')
  async getUsersList(req: Request, res: Response): Promise<void> {
    try {
      const { page = '1', limit = '10', search } = req.query;
      const result = await this.usersService.findAll({
        page: page as string,
        limit: limit as string,
        search: search as string
      });
      res.json(this.successResponse(result));
      return;
    } catch (error) {
      console.error('Get users list error:', error);
      res.status(500).json(this.errorResponse('Failed to fetch users list'));
      return;
    }
  }

  /**
   * @swagger
   * /users/platoons:
   *   get:
   *     summary: Получить список взводов (только для преподавателей)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Список взводов
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
   *                     platoons:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           id:
   *                             type: string
   *                           year_of_study:
   *                             type: integer
   *                           description:
   *                             type: string
   *       403:
   *         description: Недостаточно прав
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('roles', 'teacher')
  async getPlatoons(req: Request, res: Response): Promise<void> {
    try {
      const platoons = await this.usersService.getPlatoons();
      res.json(this.successResponse({ platoons }));
      return;
    } catch (error) {
      console.error('Get platoons error:', error);
      res.status(500).json(this.errorResponse('Failed to fetch platoons'));
      return;
    }
  }

  /**
   * @swagger
   * /users/create:
   *   post:
   *     summary: Создать нового пользователя (только для преподавателей)
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - first_name
   *               - last_name
   *               - phone_number
   *               - role
   *             properties:
   *               first_name:
   *                 type: string
   *                 example: "Иван"
   *               last_name:
   *                 type: string
   *                 example: "Иванов"
   *               patronymic:
   *                 type: string
   *                 example: "Иванович"
   *               phone_number:
   *                 type: string
   *                 example: "+79991234567"
   *               email:
   *                 type: string
   *                 example: "ivanov@example.com"
   *               role:
   *                 type: string
   *                 enum: [student, teacher]
   *                 example: "student"
   *               platoon_id:
   *                 type: string
   *                 example: "101A"
   *               password:
   *                 type: string
   *                 example: "password123"
   *     responses:
   *       200:
   *         description: Пользователь создан
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
   *                 message:
   *                   type: string
   *                   example: "User created successfully"
   *       403:
   *         description: Недостаточно прав
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('roles', 'teacher')
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const user = await this.usersService.createUser(req.body);
      res.json(this.successResponse({ user }, 'User created successfully'));
      return;
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json(this.errorResponse('Failed to create user'));
      return;
    }
  }

  /**
   * @swagger
   * /users/teacher-dashboard:
   *   get:
   *     summary: Панель управления преподавателя
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Данные панели управления
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
   *                     message:
   *                       type: string
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                         first_name:
   *                           type: string
   *                         role:
   *                           type: string
   *       403:
   *         description: Недостаточно прав
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('roles', 'teacher')
  async teacherDashboard(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUser(req);
      res.json(this.successResponse({
        message: 'Welcome to teacher dashboard',
        user: {
          id: user.id,
          first_name: user.firstName,
          role: user.role
        }
      }));
      return;
    } catch (error) {
      console.error('Teacher dashboard error:', error);
      res.status(500).json(this.errorResponse('Failed to load dashboard'));
      return;
    }
  }

  /**
   * @swagger
   * /users/student-dashboard:
   *   get:
   *     summary: Панель управления студента
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Данные панели управления
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
   *                     message:
   *                       type: string
   *                     user:
   *                       type: object
   *                       properties:
   *                         id:
   *                           type: integer
   *                         first_name:
   *                           type: string
   *                         role:
   *                           type: string
   *                         platoon_id:
   *                           type: string
   *       403:
   *         description: Недостаточно прав
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('roles', 'student')
  async studentDashboard(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUser(req);
      res.json(this.successResponse({
        message: 'Welcome to student dashboard',
        user: {
          id: user.id,
          first_name: user.firstName,
          role: user.role,
          platoon_id: user.platoonId
        }
      }));
      return;
    } catch (error) {
      console.error('Student dashboard error:', error);
      res.status(500).json(this.errorResponse('Failed to load dashboard'));
      return;
    }
  }

  /**
   * @swagger
   * /users/common-data:
   *   get:
   *     summary: Общие данные для студентов и преподавателей
   *     tags: [Users]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Общие данные
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
   *                     message:
   *                       type: string
   *                     user_role:
   *                       type: string
   *       403:
   *         description: Недостаточно прав
   *       500:
   *         description: Внутренняя ошибка сервера
   */
  @UseGuard('roles', 'student', 'teacher')
  async commonData(req: Request, res: Response): Promise<void> {
    try {
      const user = this.getUser(req);
      res.json(this.successResponse({
        message: 'This data is available for both students and teachers',
        user_role: user.role
      }));
      return;
    } catch (error) {
      console.error('Common data error:', error);
      res.status(500).json(this.errorResponse('Failed to load data'));
      return;
    }
  }
}