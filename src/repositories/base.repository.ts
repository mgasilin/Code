import { Repository, FindManyOptions, FindOneOptions, ObjectLiteral} from 'typeorm';
import { AppDataSource } from '../../ormconfig';

export class BaseRepository<T extends ObjectLiteral> {
  protected repository: Repository<T>;

  constructor(entity: new () => T) {
    this.repository = AppDataSource.getRepository(entity);
  }

  async save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  async findById(id: number | string, options?: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne({
      // @ts-ignore
      where: { id } as any,
      ...options 
    });
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async create(data: Partial<T>): Promise<T> {
    // @ts-ignore
    const entity = this.repository.create(data);
    // @ts-ignore
    return this.repository.save(entity);
  }

  async update(id: number | string, data: Partial<T>): Promise<T | null> {
    // @ts-ignore
    await this.repository.update(id, data);
    return this.findById(id);
  }

  async delete(id: number | string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected ?? 0) > 0;
  }

  async softDelete(id: number | string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return (result.affected ?? 0) > 0;
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }
}