import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from '../middleware/auth';
import { roleMiddleware } from '../middleware/roles';

type GuardType = 'auth' | 'roles';

export function UseGuard(guard: GuardType, ...roles: string[]): MethodDecorator {
  return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (req: Request, res: Response, next?: NextFunction) {
      try {
        await applyGuard(guard, roles, req, res);
        return await originalMethod.call(this, req, res, next);
      } catch (error) {
        // Ошибка уже обработана в guard middleware
        return;
      }
    };
    
    return descriptor;
  };
}

function applyGuard(guard: GuardType, roles: string[], req: Request, res: Response): Promise<void> {
  return new Promise((resolve, reject) => {
    const next = (error?: any) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    };

    switch (guard) {
      case 'auth':
        authMiddleware(req, res, next);
        break;
      case 'roles':
        roleMiddleware(...roles)(req, res, next);
        break;
      default:
        next();
    }
  });
}