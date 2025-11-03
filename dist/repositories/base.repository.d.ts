import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';
export declare class BaseRepository<T> {
    protected repository: Repository<T>;
    constructor(entity: new () => T);
    findById(id: number | string, options?: FindOneOptions<T>): Promise<T | null>;
    findAll(options?: FindManyOptions<T>): Promise<T[]>;
    create(data: Partial<T>): Promise<T>;
    update(id: number | string, data: Partial<T>): Promise<T | null>;
    delete(id: number | string): Promise<boolean>;
    softDelete(id: number | string): Promise<boolean>;
}
//# sourceMappingURL=base.repository.d.ts.map