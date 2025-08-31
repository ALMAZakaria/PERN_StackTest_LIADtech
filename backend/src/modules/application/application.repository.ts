import { PrismaClient, Application, Prisma } from '@prisma/client';

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

export class ApplicationRepository {
  async create(data: CreateApplicationData): Promise<Application> {
    return prisma.application.create({
      data: {
        ...data,
        estimatedDuration: data.estimatedDuration || 0,
        proposedRate: new (prisma as any).Prisma.Decimal(data.proposedRate),
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
      updateData.proposedRate = new (prisma as any).Prisma.Decimal(data.proposedRate);
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
