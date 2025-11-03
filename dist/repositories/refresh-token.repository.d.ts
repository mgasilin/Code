import { BaseRepository } from './base.repository';
import { RefreshToken } from '../entities/refresh-token.entity';
export declare class RefreshTokenRepository extends BaseRepository<RefreshToken> {
    constructor();
    findValidToken(token: string): Promise<RefreshToken | null>;
    revokeToken(token: string): Promise<void>;
    revokeAllUserTokens(userId: number): Promise<void>;
    cleanupExpiredTokens(): Promise<void>;
}
//# sourceMappingURL=refresh-token.repository.d.ts.map