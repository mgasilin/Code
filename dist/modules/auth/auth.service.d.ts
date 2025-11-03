export declare class AuthService {
    private userRepository;
    private refreshTokenRepository;
    constructor();
    validateUser(phoneNumber: string, password: string): Promise<import("../../entities/user.entity").User | null>;
    updateLastLogin(userId: number): Promise<void>;
    generateTokens(user: any): {
        accessToken: never;
        refreshToken: never;
    };
    saveRefreshToken(userId: number, refreshToken: string): Promise<void>;
    validateRefreshToken(refreshToken: string): Promise<import("../../entities/user.entity").User | null>;
    revokeRefreshToken(token: string): Promise<void>;
}
//# sourceMappingURL=auth.service.d.ts.map