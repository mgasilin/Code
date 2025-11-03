import { BaseRepository } from './base.repository';
import { Platoon } from '../entities/platoon.entity';
export declare class PlatoonRepository extends BaseRepository<Platoon> {
    constructor();
    findActivePlatoons(): Promise<Platoon[]>;
    findByYearOfStudy(year: number): Promise<Platoon[]>;
}
//# sourceMappingURL=platoon.repository.d.ts.map