"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class DashboardService {
    async getStatistics() {
        const [totalUsers, activeUsers, newUsersToday, totalFreelancers, totalCompanies, totalMissions] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({
                where: { isActive: true }
            }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0))
                    }
                }
            }),
            prisma.freelanceProfile.count(),
            prisma.companyProfile.count(),
            prisma.mission.count()
        ]);
        return {
            totalUsers,
            activeUsers,
            newUsersToday,
            systemStatus: 'online',
            totalFreelancers,
            totalCompanies,
            totalMissions,
        };
    }
    async getRecentActivity(limit = 10) {
        const recentUsers = await prisma.user.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                createdAt: true,
                email: true,
            }
        });
        const activities = recentUsers.map(user => ({
            id: `user_${user.id}`,
            type: 'user_registered',
            title: 'New user registered',
            description: `${user.firstName} ${user.lastName} created a new account`,
            time: user.createdAt,
            userId: user.id,
            userName: `${user.firstName} ${user.lastName}`,
        }));
        const systemActivities = [
            {
                id: 'sys_1',
                type: 'system_update',
                title: 'System maintenance',
                description: 'Database optimization completed successfully',
                time: new Date(Date.now() - 5 * 60 * 60 * 1000),
            },
            {
                id: 'sys_2',
                type: 'system_update',
                title: 'Security update',
                description: 'Security patches applied to the system',
                time: new Date(Date.now() - 24 * 60 * 60 * 1000),
            }
        ];
        const allActivities = [...activities, ...systemActivities]
            .sort((a, b) => b.time.getTime() - a.time.getTime())
            .slice(0, limit);
        return allActivities;
    }
}
exports.DashboardService = DashboardService;
//# sourceMappingURL=dashboard.service.js.map