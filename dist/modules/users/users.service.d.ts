import { User } from '../../entities/user.entity';
export declare class UsersService {
    private userRepository;
    private platoonRepository;
    constructor();
    findById(id: number): Promise<User | null>;
    findAllUsers(page?: number, limit?: number, search?: string): Promise<{
        users: User[];
        total: number;
    } | {
        users: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getPlatoons(): Promise<import("../../entities/platoon.entity").Platoon[]>;
    createUser(userData: Partial<User>): Promise<User>;
    updateUser(id: number, userData: Partial<User>): Promise<User | null>;
}
//# sourceMappingURL=users.service.d.ts.map