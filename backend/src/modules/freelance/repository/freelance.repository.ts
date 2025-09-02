import { PrismaClient, FreelanceProfile, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateFreelanceProfileData {
  userId: string;
  bio?: string;
  skills: string[];
  dailyRate: number;
  availability: number;
  location?: string;
  experience: number;
}

export interface UpdateFreelanceProfileData {
  bio?: string;
  skills?: string[];
  dailyRate?: number;
  availability?: number;
  location?: string;
  experience?: number;
}

export class FreelanceRepository {
  async create(data: CreateFreelanceProfileData): Promise<FreelanceProfile> {
    return prisma.freelanceProfile.create({
      data: {
        ...data,
        dailyRate: new Prisma.Decimal(data.dailyRate),
      },
    });
  }

  async findByUserId(userId: string): Promise<FreelanceProfile | null> {
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
        portfolio_projects: true,
      },
    });
  }

  async update(userId: string, data: UpdateFreelanceProfileData): Promise<FreelanceProfile> {
    const updateData: any = { ...data };
    if (data.dailyRate !== undefined) {
      updateData.dailyRate = new Prisma.Decimal(data.dailyRate);
    }

    return prisma.freelanceProfile.update({
      where: { userId },
      data: updateData,
    });
  }

  async delete(userId: string): Promise<FreelanceProfile> {
    return prisma.freelanceProfile.delete({
      where: { userId },
    });
  }

  async findMany(filters?: {
    skills?: string[];
    minRate?: number;
    maxRate?: number;
    location?: string;
    minExperience?: number;
  }): Promise<FreelanceProfile[]> {
    const where: Prisma.FreelanceProfileWhereInput = {};

    if (filters?.skills && filters.skills.length > 0) {
      where.skills = {
        hasSome: filters.skills,
      };
    }

    if (filters?.minRate || filters?.maxRate) {
      where.dailyRate = {};
      if (filters.minRate) {
        where.dailyRate.gte = new Prisma.Decimal(filters.minRate);
      }
      if (filters.maxRate) {
        where.dailyRate.lte = new Prisma.Decimal(filters.maxRate);
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
        portfolio_projects: {
          take: 3, // Limit to 3 portfolio items for list view
        },
      },
    });
  }
}
