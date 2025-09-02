"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationRepository = void 0;
const client_1 = require("@prisma/client");
const library_1 = require("@prisma/client/runtime/library");
const prisma = new client_1.PrismaClient();
class ApplicationRepository {
    async create(data) {
        return prisma.application.create({
            data: {
                ...data,
                estimatedDuration: data.estimatedDuration || 0,
                proposedRate: new library_1.Decimal(data.proposedRate),
            },
            include: {
                mission: true,
                freelancer: {
                    include: {
                        user: true,
                    },
                },
                company: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return prisma.application.findUnique({
            where: { id },
            include: {
                mission: true,
                freelancer: {
                    include: {
                        user: true,
                    },
                },
                company: {
                    include: {
                        user: true,
                    },
                },
                ratings: true,
            },
        });
    }
    async findByMissionId(missionId) {
        return prisma.application.findMany({
            where: { missionId },
            include: {
                freelancer: {
                    include: {
                        user: true,
                    },
                },
                ratings: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByFreelancerId(freelancerId) {
        return prisma.application.findMany({
            where: { freelancerId },
            include: {
                mission: true,
                company: {
                    include: {
                        user: true,
                    },
                },
                ratings: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByCompanyId(companyId) {
        return prisma.application.findMany({
            where: { companyId },
            include: {
                mission: true,
                freelancer: {
                    include: {
                        user: true,
                    },
                },
                ratings: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, data) {
        const updateData = { ...data };
        if (data.proposedRate !== undefined) {
            updateData.proposedRate = new library_1.Decimal(data.proposedRate);
        }
        return prisma.application.update({
            where: { id },
            data: updateData,
            include: {
                mission: true,
                freelancer: {
                    include: {
                        user: true,
                    },
                },
                company: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        return prisma.application.delete({
            where: { id },
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.missionId) {
            where.missionId = filters.missionId;
        }
        if (filters?.freelancerId) {
            where.freelancerId = filters.freelancerId;
        }
        if (filters?.companyId) {
            where.companyId = filters.companyId;
        }
        if (filters?.status) {
            where.status = filters.status;
        }
        return prisma.application.findMany({
            where,
            include: {
                mission: true,
                freelancer: {
                    include: {
                        user: true,
                    },
                },
                company: {
                    include: {
                        user: true,
                    },
                },
                ratings: true,
            },
            orderBy: { createdAt: 'desc' },
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
}
exports.ApplicationRepository = ApplicationRepository;
//# sourceMappingURL=application.repository.js.map