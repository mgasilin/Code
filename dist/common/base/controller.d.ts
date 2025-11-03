import { Request } from 'express';
import { ApiResponse } from '../types';
export declare class BaseController {
    protected getUser(req: Request): any;
    protected successResponse(data?: any, message?: string): ApiResponse;
    protected errorResponse(error: string): ApiResponse;
    protected paginatedResponse(data: any[], pagination: any): ApiResponse;
}
//# sourceMappingURL=controller.d.ts.map