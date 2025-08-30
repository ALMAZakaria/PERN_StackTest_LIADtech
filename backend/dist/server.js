"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const server_1 = require("./config/server");
const logger_1 = __importDefault(require("./utils/logger"));
const prisma_1 = __importDefault(require("./config/prisma"));
const redis_1 = __importDefault(require("./config/redis"));
process.on('uncaughtException', (error) => {
    logger_1.default.error('Uncaught Exception:', error);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.default.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
async function startServer() {
    try {
        await prisma_1.default.$connect();
        logger_1.default.info('Connected to PostgreSQL database');
        await redis_1.default.connect();
        logger_1.default.info('Connected to Redis');
        const server = app_1.default.listen(server_1.config.PORT, () => {
            logger_1.default.info(`🚀 Server running on port ${server_1.config.PORT} in ${server_1.config.NODE_ENV} mode`);
            logger_1.default.info(`📊 Health check: http://localhost:${server_1.config.PORT}/health`);
            if (server_1.config.SWAGGER_ENABLED) {
                logger_1.default.info(`📚 API Documentation: http://localhost:${server_1.config.PORT}/api-docs`);
            }
        });
        const gracefulShutdown = async (signal) => {
            logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
            server.close(async () => {
                logger_1.default.info('HTTP server closed');
                try {
                    await prisma_1.default.$disconnect();
                    logger_1.default.info('Database connection closed');
                    await redis_1.default.disconnect();
                    logger_1.default.info('Redis connection closed');
                    logger_1.default.info('Graceful shutdown completed');
                    process.exit(0);
                }
                catch (error) {
                    logger_1.default.error('Error during graceful shutdown:', error);
                    process.exit(1);
                }
            });
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=server.js.map