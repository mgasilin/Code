"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = require("./config/database");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        const dbConnected = await (0, database_1.testConnection)();
        if (!dbConnected) {
            console.error('Cannot start server without database connection');
            process.exit(1);
        }
        app_1.default.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`UMK Backend API`);
            console.log(`API: http://localhost:${PORT}/api`);
            console.log(`Health: http://localhost:${PORT}/api/health`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map