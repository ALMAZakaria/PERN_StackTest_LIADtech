import { createClient } from 'redis';
import { config } from './server';
import logger from '../utils/logger';

class RedisClient {
  private client;
  private isConnected = false;

  constructor() {
    // Only create Redis client if Redis is enabled
    if (config.REDIS_URL && config.REDIS_URL !== 'redis://localhost:6379') {
      this.client = createClient({
        url: config.REDIS_URL,
        password: config.REDIS_PASSWORD || undefined,
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
        this.isConnected = true;
      });

      this.client.on('ready', () => {
        logger.info('Redis Client Ready');
      });

      this.client.on('end', () => {
        logger.info('Redis Client Disconnected');
        this.isConnected = false;
      });
    } else {
      logger.info('Redis disabled - skipping Redis client initialization');
    }
  }

  async connect(): Promise<void> {
    try {
      if (!this.client) {
        logger.info('Redis client not initialized, skipping connection');
        return;
      }
      if (!this.isConnected) {
        await this.client.connect();
      }
    } catch (error) {
      logger.warn('Failed to connect to Redis, continuing without Redis:', error);
      // Don't throw error, just log it and continue
    }
  }

  async disconnect(): Promise<void> {
    try {
      if (!this.client) {
        logger.info('Redis client not initialized, skipping disconnect');
        return;
      }
      if (this.isConnected) {
        await this.client.disconnect();
      }
    } catch (error) {
      logger.error('Failed to disconnect from Redis:', error);
      throw error;
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.client) {
        logger.debug('Redis client not available, returning null');
        return null;
      }
      if (!this.isConnected) {
        await this.connect();
      }
      return await this.client.get(key);
    } catch (error) {
      logger.error(`Failed to get key ${key} from Redis:`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (!this.client) {
        logger.debug('Redis client not available, returning false');
        return false;
      }
      if (!this.isConnected) {
        await this.connect();
      }
      
      if (ttl) {
        await this.client.setEx(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      logger.error(`Failed to set key ${key} in Redis:`, error);
      return false;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (!this.client) {
        logger.debug('Redis client not available, returning false');
        return false;
      }
      if (!this.isConnected) {
        await this.connect();
      }
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error(`Failed to delete key ${key} from Redis:`, error);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (!this.client) {
        logger.debug('Redis client not available, returning false');
        return false;
      }
      if (!this.isConnected) {
        await this.connect();
      }
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Failed to check existence of key ${key} in Redis:`, error);
      return false;
    }
  }

  getClient() {
    return this.client || null;
  }
}

const redisClient = new RedisClient();

export default redisClient; 