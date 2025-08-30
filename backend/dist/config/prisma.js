"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const server_1 = require("./server");
const prisma = global.__prisma || new client_1.PrismaClient({
    log: server_1.config.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});
if (server_1.config.NODE_ENV === 'development') {
    global.__prisma = prisma;
}
exports.default = prisma;
//# sourceMappingURL=prisma.js.map