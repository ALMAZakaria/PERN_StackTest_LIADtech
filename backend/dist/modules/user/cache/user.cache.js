"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCache = void 0;
const redis_1 = __importDefault(require("../../../config/redis"));
class UserCache {
    constructor() {
        this.USER_KEY_PREFIX = 'user:';
        this.USER_LIST_KEY_PREFIX = 'users:';
        this.TTL = 3600;
    }
    getUserKey(id) {
        return `${this.USER_KEY_PREFIX}${id}`;
    }
    getUserListKey(query) {
        return `${this.USER_LIST_KEY_PREFIX}${query}`;
    }
    async getUser(id) {
        try {
            const cached = await redis_1.default.get(this.getUserKey(id));
            if (cached) {
                return JSON.parse(cached);
            }
            return null;
        }
        catch (error) {
            console.error('Error getting user from cache:', error);
            return null;
        }
    }
    async setUser(id, user) {
        try {
            await redis_1.default.set(this.getUserKey(id), JSON.stringify(user), this.TTL);
        }
        catch (error) {
            console.error('Error setting user in cache:', error);
        }
    }
    async getUserList(query) {
        try {
            const cached = await redis_1.default.get(this.getUserListKey(query));
            if (cached) {
                return JSON.parse(cached);
            }
            return null;
        }
        catch (error) {
            console.error('Error getting user list from cache:', error);
            return null;
        }
    }
    async setUserList(query, data) {
        try {
            await redis_1.default.set(this.getUserListKey(query), JSON.stringify(data), this.TTL);
        }
        catch (error) {
            console.error('Error setting user list in cache:', error);
        }
    }
    async deleteUser(id) {
        try {
            await redis_1.default.del(this.getUserKey(id));
            await this.clearUserListCaches();
        }
        catch (error) {
            console.error('Error deleting user from cache:', error);
        }
    }
    async clearUserCaches(id) {
        try {
            if (id) {
                await redis_1.default.del(this.getUserKey(id));
            }
            await this.clearUserListCaches();
        }
        catch (error) {
            console.error('Error clearing user caches:', error);
        }
    }
    async clearUserListCaches() {
        try {
            const client = redis_1.default.getClient();
            if (!client) {
                return;
            }
            const keys = await client.keys(`${this.USER_LIST_KEY_PREFIX}*`);
            if (keys.length > 0) {
                await client.del(keys);
            }
        }
        catch (error) {
            console.error('Error clearing user list caches:', error);
        }
    }
}
exports.UserCache = UserCache;
//# sourceMappingURL=user.cache.js.map