"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const app_1 = __importDefault(require("./app"));
const ormconfig_1 = require("../ormconfig");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await ormconfig_1.AppDataSource.initialize();
        console.log('Database connected successfully');
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`UMK Backend API - TypeORM Version`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
            console.log(`API: http://localhost:${PORT}/api`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    process.exit(0);
});
startServer();
//# sourceMappingURL=main.js.map