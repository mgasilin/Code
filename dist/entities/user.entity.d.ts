import { Platoon } from './platoon.entity';
import { RefreshToken } from './refresh-token.entity';
export declare class User {
    id: number;
    ldapUid?: string;
    phoneNumber?: string;
    passwordHash?: string;
    firstName: string;
    lastName: string;
    patronymic?: string;
    email?: string;
    platoonId?: string;
    platoon?: Platoon;
    lastLoginAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    role: 'student' | 'teacher';
    refreshTokens: RefreshToken[];
    checkPassword(password: string): Promise<boolean>;
    setPassword(password: string): Promise<void>;
}
//# sourceMappingURL=user.entity.d.ts.map