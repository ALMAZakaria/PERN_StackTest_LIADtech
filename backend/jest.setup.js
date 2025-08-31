// Jest setup file for environment configuration
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.JWT_SECRET = 'test-secret-key-change-in-production';
process.env.JWT_EXPIRES_IN = '1h';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-key-change-in-production';
process.env.JWT_REFRESH_EXPIRES_IN = '7d';

// Database configuration - use test database if available, otherwise use fallback
if (process.env.USE_TEST_DATABASE === 'true') {
  process.env.DATABASE_URL = 'postgresql://postgres:123456789%40%40%40%40@localhost:5432/Test_DB?schema=public';
  process.env.TEST_DATABASE = 'true';
} else {
  // Use a dummy URL for tests that don't need database
  process.env.DATABASE_URL = 'postgresql://dummy:dummy@localhost:5432/dummy';
  process.env.TEST_DATABASE = 'false';
}

process.env.REDIS_URL = 'redis://localhost:6379';
process.env.LOG_LEVEL = 'error';

// Mock console methods to reduce noise during tests
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}; 