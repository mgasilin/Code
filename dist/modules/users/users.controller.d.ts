import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
export declare class UsersController extends BaseController {
    private usersService;
    constructor();
    getProfile(req: Request, res: Response): Promise<void>;
    getUsersList(req: Request, res: Response): Promise<void>;
    getPlatoons(req: Request, res: Response): Promise<void>;
    createUser(req: Request, res: Response): Promise<void>;
    teacherDashboard(req: Request, res: Response): void;
    studentDashboard(req: Request, res: Response): void;
    commonData(req: Request, res: Response): void;
}
//# sourceMappingURL=users.controller.d.ts.map