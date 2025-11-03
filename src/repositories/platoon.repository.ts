import { BaseRepository } from './base.repository';
import { Platoon } from '../entities/platoon.entity';

export class PlatoonRepository extends BaseRepository<Platoon> {
  constructor() {
    super(Platoon);
  }

  async findActivePlatoons(): Promise<Platoon[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { id: 'ASC' }
    });
  }

  async findByYearOfStudy(year: number): Promise<Platoon[]> {
    return this.repository.find({
      where: { yearOfStudy: year, isActive: true },
      order: { id: 'ASC' }
    });
  }
}