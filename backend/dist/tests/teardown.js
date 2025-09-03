"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = globalTeardown;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function globalTeardown() {
    await prisma.$disconnect();
    console.log('Test teardown completed');
}
//# sourceMappingURL=teardown.js.map