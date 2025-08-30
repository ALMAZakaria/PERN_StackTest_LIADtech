import { PrismaClient, CompanyProfile, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateCompanyProfileData {
  userId: string;
  companyName: string;
  industry: string;
  size: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  description?: string;
  website?: string;
  location?: string;
}

export interface UpdateCompanyProfileData {
  companyName?: string;
  industry?: string;
  size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  description?: string;
  website?: string;
  location?: string;
}

export class CompanyRepository {
  async create(data: CreateCompanyProfileData): Promise<CompanyProfile> {
    return prisma.companyProfile.create({
      data,
    });
  }

  async findByUserId(userId: string): Promise<CompanyProfile | null> {
    return prisma.companyProfile.findUnique({
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
        missions: {
          include: {
            applications: {
              include: {
                freelancer: {
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
    });
  }

  async update(userId: string, data: UpdateCompanyProfileData): Promise<CompanyProfile> {
    return prisma.companyProfile.update({
      where: { userId },
      data,
    });
  }

  async delete(userId: string): Promise<CompanyProfile> {
    return prisma.companyProfile.delete({
      where: { userId },
    });
  }

  async findMany(filters?: {
    industry?: string;
    size?: 'STARTUP' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
    location?: string;
  }): Promise<CompanyProfile[]> {
    const where: Prisma.CompanyProfileWhereInput = {};

    if (filters?.industry) {
      where.industry = {
        contains: filters.industry,
        mode: 'insensitive',
      };
    }

    if (filters?.size) {
      where.size = filters.size;
    }

    if (filters?.location) {
      where.location = {
        contains: filters.location,
        mode: 'insensitive',
      };
    }

    return prisma.companyProfile.findMany({
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
        missions: {
          where: {
            status: 'OPEN',
          },
          take: 5, // Limit to 5 open missions for list view
        },
      },
    });
  }
}
