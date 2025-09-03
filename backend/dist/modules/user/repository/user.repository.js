"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
class UserRepository {
    async create(data) {
        return await prisma_1.default.user.create({
            data,
        });
    }
    async createWithRole(data) {
        return await prisma_1.default.user.create({
            data: {
                email: data.email,
                password: data.password,
                firstName: data.firstName,
                lastName: data.lastName,
                role: data.role.toUpperCase(),
            },
        });
    }
    async findById(id) {
        return await prisma_1.default.user.findUnique({
            where: { id },
        });
    }
    async findByEmail(email) {
        return await prisma_1.default.user.findUnique({
            where: { email },
        });
    }
    async findMany(query) {
        const page = query.page || 1;
        const limit = Math.min(query.limit || 10, 100);
        const skip = (page - 1) * limit;
        const where = {};
        if (query.search) {
            where.OR = [
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
                { email: { contains: query.search, mode: 'insensitive' } },
            ];
        }
        if (query.role) {
            where.role = query.role;
        }
        if (query.isActive !== undefined) {
            where.isActive = query.isActive;
        }
        const [users, total] = await Promise.all([
            prisma_1.default.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma_1.default.user.count({ where }),
        ]);
        return {
            users,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async update(id, data) {
        return await prisma_1.default.user.update({
            where: { id },
            data,
        });
    }
    async updatePassword(id, hashedPassword) {
        return await prisma_1.default.user.update({
            where: { id },
            data: { password: hashedPassword },
        });
    }
    async delete(id) {
        return await prisma_1.default.user.update({
            where: { id },
            data: { isActive: false },
        });
    }
    async hardDelete(id) {
        return await prisma_1.default.user.delete({
            where: { id },
        });
    }
    async existsByEmail(email, excludeId) {
        const where = { email };
        if (excludeId) {
            where.NOT = { id: excludeId };
        }
        const count = await prisma_1.default.user.count({ where });
        return count > 0;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map