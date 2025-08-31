"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class MissionRepository {
    async create(data) {
        return prisma.mission.create({
            data: {
                ...data,
                budget: new client_1.Prisma.Decimal(data.budget),
            },
        });
    }
    async findById(id) {
        return prisma.mission.findUnique({
            where: { id },
            include: {
                company: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
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
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.budget !== undefined) {
            updateData.budget = new client_1.Prisma.Decimal(data.budget);
        }
        return prisma.mission.update({
            where: { id },
            data: updateData,
        });
    }
    async delete(id) {
        return prisma.mission.delete({
            where: { id },
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.status) {
            where.status = filters.status;
        }
        if (filters?.skills && filters.skills.length > 0) {
            where.requiredSkills = {
                hasSome: filters.skills,
            };
        }
        if (filters?.minBudget || filters?.maxBudget) {
            where.budget = {};
            if (filters.minBudget) {
                where.budget.gte = new client_1.Prisma.Decimal(filters.minBudget);
            }
            if (filters.maxBudget) {
                where.budget.lte = new client_1.Prisma.Decimal(filters.maxBudget);
            }
        }
        if (filters?.location) {
            where.location = {
                contains: filters.location,
                mode: 'insensitive',
            };
        }
        if (filters?.isRemote !== undefined) {
            where.isRemote = filters.isRemote;
        }
        if (filters?.companyId) {
            where.companyId = filters.companyId;
        }
        return prisma.mission.findMany({
            where,
            include: {
                company: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                email: true,
                            },
                        },
                    },
                },
                applications: {
                    take: 3,
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
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async findByCompanyId(companyId) {
        return prisma.mission.findMany({
            where: { companyId },
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
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
exports.MissionRepository = MissionRepository;
//# sourceMappingURL=mission.repository.js.map