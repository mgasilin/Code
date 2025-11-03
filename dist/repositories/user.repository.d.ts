import { FindOneOptions, FindManyOptions } from 'typeorm';
import { BaseRepository } from './base.repository';
import { User } from '../entities/user.entity';
export declare class UserRepository extends BaseRepository<User> {
    constructor();
    findByPhoneNumber(phoneNumber: string, options?: FindOneOptions<User>): Promise<User | null>;
    findByLdapUid(ldapUid: string, options?: FindOneOptions<User>): Promise<User | null>;
    findActiveUsers(options?: FindManyOptions<User>): Promise<User[]>;
    searchUsers(query: string, page?: number, limit?: number): Promise<{
        users: User[];
        total: number;
    }>;
    updateLastLogin(userId: number): Promise<void>;
}
//# sourceMappingURL=user.repository.d.ts.map