"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlatoonRepository = void 0;
const base_repository_1 = require("./base.repository");
const platoon_entity_1 = require("../entities/platoon.entity");
class PlatoonRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(platoon_entity_1.Platoon);
    }
    async findActivePlatoons() {
        return this.repository.find({
            where: { isActive: true },
            order: { id: 'ASC' }
        });
    }
    async findByYearOfStudy(year) {
        return this.repository.find({
            where: { yearOfStudy: year, isActive: true },
            order: { id: 'ASC' }
        });
    }
}
exports.PlatoonRepository = PlatoonRepository;
//# sourceMappingURL=platoon.repository.js.map