"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const server_1 = require("./server");
const logger_1 = __importDefault(require("../../src/utils/logger"));
class RedisClient {
    constructor() {
        this.isConnected = false;
        if (server_1.config.REDIS_URL && server_1.config.REDIS_URL !== 'redis://localhost:6379') {
            this.client = (0, redis_1.createClient)({
                url: server_1.config.REDIS_URL,
                password: server_1.config.REDIS_PASSWORD || undefined,
            });
            this.client.on('error', (err) => {
                logger_1.default.error('Redis Client Error:', err);
                this.isConnected = false;
            });
            this.client.on('connect', () => {
                logger_1.default.info('Redis Client Connected');
                this.isConnected = true;
            });
            this.client.on('ready', () => {
                logger_1.default.info('Redis Client Ready');
            });
            this.client.on('end', () => {
                logger_1.default.info('Redis Client Disconnected');
                this.isConnected = false;
            });
        }
        else {
            logger_1.default.info('Redis disabled - skipping Redis client initialization');
        }
    }
    async connect() {
        try {
            if (!this.client) {
                logger_1.default.info('Redis client not initialized, skipping connection');
                return;
            }
            if (!this.isConnected) {
                await this.client.connect();
            }
        }
        catch (error) {
            logger_1.default.warn('Failed to connect to Redis, continuing without Redis:', error);
        }
    }
    async disconnect() {
        try {
            if (!this.client) {
                logger_1.default.info('Redis client not initialized, skipping disconnect');
                return;
            }
            if (this.isConnected) {
                await this.client.disconnect();
            }
        }
        catch (error) {
            logger_1.default.error('Failed to disconnect from Redis:', error);
            throw error;
        }
    }
    async get(key) {
        try {
            if (!this.client) {
                logger_1.default.debug('Redis client not available, returning null');
                return null;
            }
            if (!this.isConnected) {
                await this.connect();
            }
            return await this.client.get(key);
        }
        catch (error) {
            logger_1.default.error(`Failed to get key ${key} from Redis:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            if (!this.client) {
                logger_1.default.debug('Redis client not available, returning false');
                return false;
            }
            if (!this.isConnected) {
                await this.connect();
            }
            if (ttl) {
                await this.client.setEx(key, ttl, value);
            }
            else {
                await this.client.set(key, value);
            }
            return true;
        }
        catch (error) {
            logger_1.default.error(`Failed to set key ${key} in Redis:`, error);
            return false;
        }
    }
    async del(key) {
        try {
            if (!this.client) {
                logger_1.default.debug('Redis client not available, returning false');
                return false;
            }
            if (!this.isConnected) {
                await this.connect();
            }
            await this.client.del(key);
            return true;
        }
        catch (error) {
            logger_1.default.error(`Failed to delete key ${key} from Redis:`, error);
            return false;
        }
    }
    async exists(key) {
        try {
            if (!this.client) {
                logger_1.default.debug('Redis client not available, returning false');
                return false;
            }
            if (!this.isConnected) {
                await this.connect();
            }
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            logger_1.default.error(`Failed to check existence of key ${key} in Redis:`, error);
            return false;
        }
    }
    getClient() {
        return this.client || null;
    }
}
const redisClient = new RedisClient();
exports.default = redisClient;
//# sourceMappingURL=redis.js.map