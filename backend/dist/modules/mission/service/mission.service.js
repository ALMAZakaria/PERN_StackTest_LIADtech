"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionService = void 0;
const mission_repository_1 = require("../repository/mission.repository");
const AppError_1 = require("../../../utils/AppError");
class MissionService {
    constructor() {
        this.missionRepository = new mission_repository_1.MissionRepository();
    }
    async createMission(userId, data) {
        if (!data.title.trim()) {
            throw new AppError_1.AppError('Mission title is required', 400);
        }
        if (!data.description.trim()) {
            throw new AppError_1.AppError('Mission description is required', 400);
        }
        if (data.requiredSkills.length === 0) {
            throw new AppError_1.AppError('At least one required skill is needed', 400);
        }
        if (data.budget <= 0) {
            throw new AppError_1.AppError('Budget must be greater than 0', 400);
        }
        if (data.duration <= 0) {
            throw new AppError_1.AppError('Duration must be greater than 0', 400);
        }
        const { CompanyRepository } = await Promise.resolve().then(() => __importStar(require('../../company/repository/company.repository')));
        const companyRepository = new CompanyRepository();
        const companyProfile = await companyRepository.findByUserId(userId);
        if (!companyProfile) {
            throw new AppError_1.AppError('Company profile required to create missions', 400);
        }
        return this.missionRepository.create({
            ...data,
            companyId: companyProfile.id,
        });
    }
    async getMission(id) {
        const mission = await this.missionRepository.findById(id);
        if (!mission) {
            throw new AppError_1.AppError('Mission not found', 404);
        }
        return mission;
    }
    async updateMission(id, userId, data) {
        const mission = await this.missionRepository.findById(id);
        if (!mission) {
            throw new AppError_1.AppError('Mission not found', 404);
        }
        const { CompanyRepository } = await Promise.resolve().then(() => __importStar(require('../../company/repository/company.repository')));
        const companyRepository = new CompanyRepository();
        const companyProfile = await companyRepository.findByUserId(userId);
        if (!companyProfile || mission.companyId !== companyProfile.id) {
            throw new AppError_1.AppError('Not authorized to update this mission', 403);
        }
        if (data.title !== undefined && !data.title.trim()) {
            throw new AppError_1.AppError('Mission title cannot be empty', 400);
        }
        if (data.description !== undefined && !data.description.trim()) {
            throw new AppError_1.AppError('Mission description cannot be empty', 400);
        }
        if (data.requiredSkills !== undefined && data.requiredSkills.length === 0) {
            throw new AppError_1.AppError('At least one required skill is needed', 400);
        }
        if (data.budget !== undefined && data.budget <= 0) {
            throw new AppError_1.AppError('Budget must be greater than 0', 400);
        }
        if (data.duration !== undefined && data.duration <= 0) {
            throw new AppError_1.AppError('Duration must be greater than 0', 400);
        }
        if (data.status) {
            const validTransitions = {
                'OPEN': ['IN_PROGRESS', 'CANCELLED'],
                'IN_PROGRESS': ['COMPLETED', 'CANCELLED'],
                'COMPLETED': [],
                'CANCELLED': []
            };
            const currentStatus = mission.status;
            const allowedTransitions = validTransitions[currentStatus] || [];
            if (!allowedTransitions.includes(data.status)) {
                throw new AppError_1.AppError(`Invalid status transition from ${currentStatus} to ${data.status}`, 400);
            }
        }
        const updatedMission = await this.missionRepository.update(id, data);
        if (data.status && data.status !== mission.status) {
            const { NotificationService } = await Promise.resolve().then(() => __importStar(require('../../notification/notification.service')));
            const notificationService = new NotificationService();
            const { ApplicationRepository } = await Promise.resolve().then(() => __importStar(require('../../application/application.repository')));
            const applicationRepository = new ApplicationRepository();
            const applications = await applicationRepository.findByMissionId(id);
            applications.forEach(async (application) => {
                await notificationService.notifyMissionUpdated(application.freelancerId, mission.title, `Status changed to ${data.status}`);
            });
        }
        return updatedMission;
    }
    async deleteMission(id, userId) {
        const mission = await this.missionRepository.findById(id);
        if (!mission) {
            throw new AppError_1.AppError('Mission not found', 404);
        }
        const { CompanyRepository } = await Promise.resolve().then(() => __importStar(require('../../company/repository/company.repository')));
        const companyRepository = new CompanyRepository();
        const companyProfile = await companyRepository.findByUserId(userId);
        if (!companyProfile || mission.companyId !== companyProfile.id) {
            throw new AppError_1.AppError('Not authorized to delete this mission', 403);
        }
        await this.missionRepository.delete(id);
    }
    async searchMissions(filters) {
        return this.missionRepository.findMany(filters);
    }
    async getCompanyMissions(userId) {
        const { CompanyRepository } = await Promise.resolve().then(() => __importStar(require('../../company/repository/company.repository')));
        const companyRepository = new CompanyRepository();
        const companyProfile = await companyRepository.findByUserId(userId);
        if (!companyProfile) {
            throw new AppError_1.AppError('Company profile not found', 404);
        }
        return this.missionRepository.findByCompanyId(companyProfile.id);
    }
    async getRecommendedFreelancers(missionId) {
        const mission = await this.missionRepository.findById(missionId);
        if (!mission) {
            throw new AppError_1.AppError('Mission not found', 404);
        }
        const { FreelanceRepository } = await Promise.resolve().then(() => __importStar(require('../../freelance/repository/freelance.repository')));
        const freelanceRepository = new FreelanceRepository();
        return freelanceRepository.findMany({
            skills: mission.requiredSkills,
        });
    }
}
exports.MissionService = MissionService;
//# sourceMappingURL=mission.service.js.map