import { User } from './user.entity';
export declare class RefreshToken {
    id: number;
    userId: number;
    user: User;
    token: string;
    expiresAt: Date;
    createdAt: Date;
    revokedAt?: Date;
    isValid(): boolean;
}
//# sourceMappingURL=refresh-token.entity.d.ts.map