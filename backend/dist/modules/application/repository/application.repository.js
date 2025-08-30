"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class ApplicationRepository {
    async create(data) {
        return prisma.application.create({
            data,
        });
    }
    async findById(id) {
        return prisma.application.findUnique({
            where: { id },
            include: {
                mission: {
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
                    },
                },
                freelancer: {
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
            },
        });
    }
    async findByMissionId(missionId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where: { missionId },
                include: {
                    freelancer: {
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
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.application.count({ where: { missionId } }),
        ]);
        return {
            applications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findByFreelancerId(freelancerId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [applications, total] = await Promise.all([
            prisma.application.findMany({
                where: { freelancerId },
                include: {
                    mission: {
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
                        },
                    },
                },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.application.count({ where: { freelancerId } }),
        ]);
        return {
            applications,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async update(id, data) {
        return prisma.application.update({
            where: { id },
            data,
        });
    }
    async updateStatus(id, status) {
        return prisma.application.update({
            where: { id },
            data: { status: status },
        });
    }
    async delete(id) {
        return prisma.application.delete({
            where: { id },
        });
    }
    async checkExistingApplication(missionId, freelancerId) {
        return prisma.application.findUnique({
            where: {
                missionId_freelancerId: {
                    missionId,
                    freelancerId,
                },
            },
        });
    }
    async getApplicationStats(freelancerId, companyId) {
        const where = {};
        if (freelancerId) {
            where.freelancerId = freelancerId;
        }
        if (companyId) {
            where.mission = {
                companyId,
            };
        }
        const [total, pending, accepted, rejected] = await Promise.all([
            prisma.application.count({ where }),
            prisma.application.count({ where: { ...where, status: 'PENDING' } }),
            prisma.application.count({ where: { ...where, status: 'ACCEPTED' } }),
            prisma.application.count({ where: { ...where, status: 'REJECTED' } }),
        ]);
        return {
            total,
            pending,
            accepted,
            rejected,
        };
    }
}
exports.ApplicationRepository = ApplicationRepository;
//# sourceMappingURL=application.repository.js.map