"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RatingRepository = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class RatingRepository {
    async create(data) {
        return prisma.rating.create({
            data,
            include: {
                application: {
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
                },
                users_ratings_raterIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                users_ratings_ratedIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findById(id) {
        return prisma.rating.findUnique({
            where: { id },
            include: {
                application: {
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
                },
                users_ratings_raterIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                users_ratings_ratedIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findByApplicationId(applicationId) {
        return prisma.rating.findFirst({
            where: { applicationId },
            include: {
                application: {
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
                },
                users_ratings_raterIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                users_ratings_ratedIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async findByUserId(userId) {
        return prisma.rating.findMany({
            where: {
                OR: [
                    { fromUserId: userId },
                    { toUserId: userId },
                ],
            },
            include: {
                application: {
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
                },
                users_ratings_raterIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                users_ratings_ratedIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async update(id, data) {
        return prisma.rating.update({
            where: { id },
            data,
            include: {
                application: {
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
                },
                users_ratings_raterIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                users_ratings_ratedIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    }
    async delete(id) {
        return prisma.rating.delete({
            where: { id },
        });
    }
    async findMany(filters) {
        const where = {};
        if (filters?.fromUserId) {
            where.fromUserId = filters.fromUserId;
        }
        if (filters?.toUserId) {
            where.toUserId = filters.toUserId;
        }
        if (filters?.applicationId) {
            where.applicationId = filters.applicationId;
        }
        return prisma.rating.findMany({
            where,
            include: {
                application: {
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
                },
                users_ratings_raterIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                users_ratings_ratedIdTousers: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getUserAverageRating(userId) {
        const ratings = await prisma.rating.findMany({
            where: { toUserId: userId },
            select: { rating: true },
        });
        if (ratings.length === 0) {
            return { average: 0, count: 0 };
        }
        const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);
        const average = total / ratings.length;
        return { average, count: ratings.length };
    }
}
exports.RatingRepository = RatingRepository;
//# sourceMappingURL=rating.repository.js.map