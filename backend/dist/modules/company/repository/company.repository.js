"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CompanyRepository {
    async create(data) {
        return prisma.companyProfile.create({
            data,
        });
    }
    async findByUserId(userId) {
        return prisma.companyProfile.findUnique({
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
                missions: {
                    include: {
                        applications: {
                            include: {
                                freelancer: {
                                    select: {
                                        id: true,
                                        user: {
                                            select: {
                                                firstName: true,
                                                lastName: true,
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
    async update(userId, data) {
        return prisma.companyProfile.update({
            where: { userId },
            data,
        });
    }
    async delete(userId) {
        return prisma.companyProfile.delete({
            where: { userId },
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.industry) {
            where.industry = {
                contains: filters.industry,
                mode: 'insensitive',
            };
        }
        if (filters?.size) {
            where.size = filters.size;
        }
        if (filters?.location) {
            where.location = {
                contains: filters.location,
                mode: 'insensitive',
            };
        }
        return prisma.companyProfile.findMany({
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
                missions: {
                    where: {
                        status: 'OPEN',
                    },
                    take: 5,
                },
            },
        });
    }
}
exports.CompanyRepository = CompanyRepository;
//# sourceMappingURL=company.repository.js.map