"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class PortfolioRepository {
    async create(data) {
        return prisma.portfolioProject.create({
            data,
        });
    }
    async findById(id) {
        return prisma.portfolioProject.findUnique({
            where: { id },
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
        });
    }
    async findByFreelancerId(freelancerId) {
        return prisma.portfolioProject.findMany({
            where: { freelancerId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, data) {
        return prisma.portfolioProject.update({
            where: { id },
            data,
        });
    }
    async delete(id) {
        return prisma.portfolioProject.delete({
            where: { id },
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.technologies && filters.technologies.length > 0) {
            where.technologies = {
                hasSome: filters.technologies,
            };
        }
        if (filters?.freelancerId) {
            where.freelancerId = filters.freelancerId;
        }
        return prisma.portfolioProject.findMany({
            where,
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
            orderBy: { createdAt: 'desc' },
        });
    }
}
exports.PortfolioRepository = PortfolioRepository;
//# sourceMappingURL=portfolio.repository.js.map