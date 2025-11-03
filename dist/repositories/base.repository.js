"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const ormconfig_1 = require("../../ormconfig");
class BaseRepository {
    constructor(entity) {
        this.repository = ormconfig_1.AppDataSource.getRepository(entity);
    }
    async findById(id, options) {
        return this.repository.findOne({
            where: { id },
            ...options
        });
    }
    async findAll(options) {
        return this.repository.find(options);
    }
    async create(data) {
        const entity = this.repository.create(data);
        return this.repository.save(entity);
    }
    async update(id, data) {
        await this.repository.update(id, data);
        return this.findById(id);
    }
    async delete(id) {
        const result = await this.repository.delete(id);
        return result.affected !== null && result.affected > 0;
    }
    async softDelete(id) {
        const result = await this.repository.softDelete(id);
        return result.affected !== null && result.affected > 0;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=base.repository.js.map