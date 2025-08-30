import { PrismaClient, PortfolioProject, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreatePortfolioProjectData {
  title: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  projectUrl?: string;
  freelancerId: string;
}

export interface UpdatePortfolioProjectData {
  title?: string;
  description?: string;
  technologies?: string[];
  imageUrl?: string;
  projectUrl?: string;
}

export class PortfolioRepository {
  async create(data: CreatePortfolioProjectData): Promise<PortfolioProject> {
    return prisma.portfolioProject.create({
      data,
    });
  }

  async findById(id: string): Promise<PortfolioProject | null> {
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

  async findByFreelancerId(freelancerId: string): Promise<PortfolioProject[]> {
    return prisma.portfolioProject.findMany({
      where: { freelancerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: UpdatePortfolioProjectData): Promise<PortfolioProject> {
    return prisma.portfolioProject.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<PortfolioProject> {
    return prisma.portfolioProject.delete({
      where: { id },
    });
  }

  async findMany(filters?: {
    technologies?: string[];
    freelancerId?: string;
  }): Promise<PortfolioProject[]> {
    const where: Prisma.PortfolioProjectWhereInput = {};

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
