import { PrismaClient, Mission, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateMissionData {
  title: string;
  description: string;
  requiredSkills: string[];
  budget: number;
  duration: number;
  location?: string;
  isRemote: boolean;
  companyId: string;
}

export interface UpdateMissionData {
  title?: string;
  description?: string;
  requiredSkills?: string[];
  budget?: number;
  duration?: number;
  location?: string;
  isRemote?: boolean;
  status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export class MissionRepository {
  async create(data: CreateMissionData): Promise<Mission> {
    return prisma.mission.create({
      data: {
        ...data,
        budget: new Prisma.Decimal(data.budget),
      },
    });
  }

  async findById(id: string): Promise<Mission | null> {
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

  async update(id: string, data: UpdateMissionData): Promise<Mission> {
    const updateData: any = { ...data };
    if (data.budget !== undefined) {
      updateData.budget = new Prisma.Decimal(data.budget);
    }

    return prisma.mission.update({
      where: { id },
      data: updateData,
    });
  }

  async delete(id: string): Promise<Mission> {
    return prisma.mission.delete({
      where: { id },
    });
  }

  async findMany(filters?: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    skills?: string[];
    minBudget?: number;
    maxBudget?: number;
    location?: string;
    isRemote?: boolean;
    companyId?: string;
  }): Promise<Mission[]> {
    const where: Prisma.MissionWhereInput = {};

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
        where.budget.gte = new Prisma.Decimal(filters.minBudget);
      }
      if (filters.maxBudget) {
        where.budget.lte = new Prisma.Decimal(filters.maxBudget);
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
          take: 3, // Limit to 3 applications for list view
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

  async findByCompanyId(companyId: string): Promise<Mission[]> {
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
