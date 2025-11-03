import { Request, Response } from 'express';
import { BaseController } from '../../common/base/base.controller';
export declare class AuthController extends BaseController {
    private authService;
    constructor();
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: Request, res: Response): Promise<void>;
    getProfile(req: Request, res: Response): void;
}
//# sourceMappingURL=auth.controller.d.ts.map