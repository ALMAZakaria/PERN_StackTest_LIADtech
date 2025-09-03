import { PrismaClient, Application, Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

export interface CreateApplicationData {
  missionId: string;
  freelancerId: string;
  companyId: string;
  proposal: string;
  proposedRate: number;
  estimatedDuration?: number;
}

export interface UpdateApplicationData {
  proposal?: string;
  proposedRate?: number;
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';
}

export interface ApplicationFilters {
  missionId?: string;
  freelancerId?: string;
  companyId?: string;
  status?: string;
  minRate?: number;
  maxRate?: number;
  minDuration?: number;
  maxDuration?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ApplicationRepository {
  async create(data: CreateApplicationData): Promise<Application> {
    return prisma.application.create({
      data: {
        ...data,
        estimatedDuration: data.estimatedDuration || 0,
        proposedRate: new Decimal(data.proposedRate),
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

  async findById(id: string): Promise<Application | null> {
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

  async findByMissionId(missionId: string): Promise<Application[]> {
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

  async findByFreelancerId(freelancerId: string): Promise<Application[]> {
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

  async findByCompanyId(companyId: string): Promise<Application[]> {
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

  async update(id: string, data: UpdateApplicationData): Promise<Application> {
    const updateData: any = { ...data };
    if (data.proposedRate !== undefined) {
      updateData.proposedRate = new Decimal(data.proposedRate);
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

  async delete(id: string): Promise<Application> {
    return prisma.application.delete({
      where: { id },
    });
  }

  async findMany(filters?: {
    missionId?: string;
    freelancerId?: string;
    companyId?: string;
    status?: string;
  }): Promise<Application[]> {
    const where: Prisma.ApplicationWhereInput = {};

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
      where.status = filters.status as any;
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

  async findManyWithPagination(
    filters?: ApplicationFilters,
    pagination?: PaginationOptions
  ): Promise<PaginatedResult<Application>> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;
    
    const where: Prisma.ApplicationWhereInput = {};

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
      where.status = filters.status as any;
    }

    if (filters?.minRate || filters?.maxRate) {
      where.proposedRate = {};
      if (filters.minRate) {
        where.proposedRate.gte = new Decimal(filters.minRate);
      }
      if (filters.maxRate) {
        where.proposedRate.lte = new Decimal(filters.maxRate);
      }
    }

    if (filters?.minDuration || filters?.maxDuration) {
      where.estimatedDuration = {};
      if (filters.minDuration) {
        where.estimatedDuration.gte = filters.minDuration;
      }
      if (filters.maxDuration) {
        where.estimatedDuration.lte = filters.maxDuration;
      }
    }

    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
      }
    }

    // Build orderBy clause
    const orderBy: Prisma.ApplicationOrderByWithRelationInput = {};
    if (pagination?.sortBy) {
      orderBy[pagination.sortBy as keyof Prisma.ApplicationOrderByWithRelationInput] = 
        pagination.sortOrder || 'desc';
    } else {
      orderBy.createdAt = 'desc';
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
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
        orderBy,
        skip,
        take: limit,
      }),
      prisma.application.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: applications,
      meta: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  }

  async checkExistingApplication(missionId: string, freelancerId: string): Promise<Application | null> {
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
