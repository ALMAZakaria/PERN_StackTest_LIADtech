import { PrismaClient, Rating, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateRatingData {
  applicationId: string;
  rating: number;
  comment?: string;
  fromUserId: string;
  toUserId: string;
}

export interface UpdateRatingData {
  rating?: number;
  comment?: string;
}

export class RatingRepository {
  async create(data: CreateRatingData): Promise<Rating> {
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

  async findById(id: string): Promise<Rating | null> {
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

  async findByApplicationId(applicationId: string): Promise<Rating | null> {
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

  async findByUserId(userId: string): Promise<Rating[]> {
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

  async update(id: string, data: UpdateRatingData): Promise<Rating> {
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

  async delete(id: string): Promise<Rating> {
    return prisma.rating.delete({
      where: { id },
    });
  }

  async findMany(filters?: {
    fromUserId?: string;
    toUserId?: string;
    applicationId?: string;
  }): Promise<Rating[]> {
    const where: Prisma.RatingWhereInput = {};

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

  async getUserAverageRating(userId: string): Promise<{ average: number; count: number }> {
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
