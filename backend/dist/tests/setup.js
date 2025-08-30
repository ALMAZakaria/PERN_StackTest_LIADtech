"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const originalConsole = { ...console };
(0, globals_1.beforeAll)(() => {
    console.log = jest.fn();
    console.error = jest.fn();
    console.warn = jest.fn();
    console.info = jest.fn();
});
(0, globals_1.afterAll)(() => {
    Object.assign(console, originalConsole);
});
global.testUtils = {
    createTestUser: (overrides = {}) => ({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123',
        role: 'user',
        ...overrides
    }),
    getAdminCredentials: () => ({
        email: 'admin@demo.com',
        password: 'demo123'
    }),
    extractToken: (authResponse) => {
        return authResponse.body.data.token;
    },
    createAuthHeader: (token) => ({
        Authorization: `Bearer ${token}`
    })
};
expect.extend({
    toBeValidApiResponse(received) {
        const pass = received &&
            typeof received.success === 'boolean' &&
            typeof received.message === 'string';
        if (pass) {
            return {
                message: () => `expected ${received} not to be a valid API response`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected ${received} to be a valid API response with success and message properties`,
                pass: false,
            };
        }
    },
    toHaveValidToken(received) {
        const token = received.body?.data?.token;
        const pass = token &&
            typeof token === 'string' &&
            token.split('.').length === 3;
        if (pass) {
            return {
                message: () => `expected response not to have a valid JWT token`,
                pass: true,
            };
        }
        else {
            return {
                message: () => `expected response to have a valid JWT token`,
                pass: false,
            };
        }
    }
});
//# sourceMappingURL=setup.js.map