"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreelanceRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class FreelanceRepository {
    async create(data) {
        return prisma.freelanceProfile.create({
            data: {
                ...data,
                dailyRate: new client_1.Prisma.Decimal(data.dailyRate),
            },
        });
    }
    async findByUserId(userId) {
        return prisma.freelanceProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        isActive: true,
                    },
                },
                portfolio: true,
            },
        });
    }
    async update(userId, data) {
        const updateData = { ...data };
        if (data.dailyRate !== undefined) {
            updateData.dailyRate = new client_1.Prisma.Decimal(data.dailyRate);
        }
        return prisma.freelanceProfile.update({
            where: { userId },
            data: updateData,
        });
    }
    async delete(userId) {
        return prisma.freelanceProfile.delete({
            where: { userId },
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.skills && filters.skills.length > 0) {
            where.skills = {
                hasSome: filters.skills,
            };
        }
        if (filters?.minRate || filters?.maxRate) {
            where.dailyRate = {};
            if (filters.minRate) {
                where.dailyRate.gte = new client_1.Prisma.Decimal(filters.minRate);
            }
            if (filters.maxRate) {
                where.dailyRate.lte = new client_1.Prisma.Decimal(filters.maxRate);
            }
        }
        if (filters?.location) {
            where.location = {
                contains: filters.location,
                mode: 'insensitive',
            };
        }
        if (filters?.minExperience) {
            where.experience = {
                gte: filters.minExperience,
            };
        }
        return prisma.freelanceProfile.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        isActive: true,
                    },
                },
                portfolio: {
                    take: 3,
                },
            },
        });
    }
}
exports.FreelanceRepository = FreelanceRepository;
//# sourceMappingURL=freelance.repository.js.map