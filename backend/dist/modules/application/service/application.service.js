"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationService = void 0;
const application_repository_1 = require("../repository/application.repository");
const error_handler_1 = require("../../../utils/error-handler");
class ApplicationService {
    constructor() {
        this.applicationRepository = new application_repository_1.ApplicationRepository();
    }
    async createApplication(freelancerId, data) {
        const existingApplication = await this.applicationRepository.checkExistingApplication(data.missionId, freelancerId);
        if (existingApplication) {
            throw new error_handler_1.ConflictError('You have already applied to this mission');
        }
        const totalProposedCost = data.proposedRate * data.estimatedDuration * 5;
        if (totalProposedCost <= 0) {
            throw new error_handler_1.ValidationError('Total proposed cost must be positive');
        }
        const application = await this.applicationRepository.create({
            ...data,
            mission: { connect: { id: data.missionId } },
            freelancer: { connect: { id: freelancerId } },
        });
        return this.mapToResponse(application);
    }
    async getApplicationById(id) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new error_handler_1.NotFoundError('Application not found');
        }
        return this.mapToResponse(application);
    }
    async getApplicationsByMission(missionId, page = 1, limit = 20) {
        const result = await this.applicationRepository.findByMissionId(missionId, page, limit);
        return {
            applications: result.applications.map(app => this.mapToResponse(app)),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
    async getApplicationsByFreelancer(freelancerId, page = 1, limit = 20) {
        const result = await this.applicationRepository.findByFreelancerId(freelancerId, page, limit);
        return {
            applications: result.applications.map(app => this.mapToResponse(app)),
            total: result.total,
            page: result.page,
            limit: result.limit,
            totalPages: result.totalPages,
        };
    }
    async updateApplication(id, data) {
        const existingApplication = await this.applicationRepository.findById(id);
        if (!existingApplication) {
            throw new error_handler_1.NotFoundError('Application not found');
        }
        if (data.proposedRate && data.estimatedDuration) {
            const totalProposedCost = data.proposedRate * data.estimatedDuration * 5;
            if (totalProposedCost <= 0) {
                throw new error_handler_1.ValidationError('Total proposed cost must be positive');
            }
        }
        const updatedApplication = await this.applicationRepository.update(id, data);
        return this.mapToResponse(updatedApplication);
    }
    async updateApplicationStatus(id, data) {
        const existingApplication = await this.applicationRepository.findById(id);
        if (!existingApplication) {
            throw new error_handler_1.NotFoundError('Application not found');
        }
        const updatedApplication = await this.applicationRepository.updateStatus(id, data.status);
        return this.mapToResponse(updatedApplication);
    }
    async deleteApplication(id) {
        const existingApplication = await this.applicationRepository.findById(id);
        if (!existingApplication) {
            throw new error_handler_1.NotFoundError('Application not found');
        }
        await this.applicationRepository.delete(id);
    }
    async getApplicationStats(freelancerId, companyId) {
        return await this.applicationRepository.getApplicationStats(freelancerId, companyId);
    }
    mapToResponse(application) {
        return {
            id: application.id,
            missionId: application.missionId,
            freelancerId: application.freelancerId,
            proposal: application.proposal,
            proposedRate: Number(application.proposedRate),
            estimatedDuration: application.estimatedDuration,
            status: application.status,
            createdAt: application.createdAt,
            updatedAt: application.updatedAt,
            mission: {
                id: application.mission.id,
                title: application.mission.title,
                budget: Number(application.mission.budget),
                company: {
                    id: application.mission.company.id,
                    companyName: application.mission.company.companyName,
                    user: {
                        id: application.mission.company.user.id,
                        firstName: application.mission.company.user.firstName,
                        lastName: application.mission.company.user.lastName,
                        email: application.mission.company.user.email,
                    },
                },
            },
            freelancer: {
                id: application.freelancer.id,
                skills: application.freelancer.skills,
                dailyRate: Number(application.freelancer.dailyRate),
                user: {
                    id: application.freelancer.user.id,
                    firstName: application.freelancer.user.firstName,
                    lastName: application.freelancer.user.lastName,
                    email: application.freelancer.user.email,
                },
            },
        };
    }
}
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map