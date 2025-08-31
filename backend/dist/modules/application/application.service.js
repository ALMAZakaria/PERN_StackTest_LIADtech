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
exports.ApplicationService = void 0;
const application_repository_1 = require("./application.repository");
const AppError_1 = require("../../utils/AppError");
class ApplicationService {
    constructor() {
        this.applicationRepository = new application_repository_1.ApplicationRepository();
    }
    async createApplication(userId, data) {
        if (!data.proposal.trim()) {
            throw new AppError_1.AppError('Proposal is required', 400);
        }
        if (data.proposedRate <= 0) {
            throw new AppError_1.AppError('Proposed rate must be positive', 400);
        }
        const existingApplication = await this.applicationRepository.checkExistingApplication(data.missionId, data.freelancerId);
        if (existingApplication) {
            throw new AppError_1.AppError('You have already applied to this mission', 400);
        }
        const { FreelanceRepository } = await Promise.resolve().then(() => __importStar(require('../freelance/repository/freelance.repository')));
        const freelanceRepository = new FreelanceRepository();
        const freelanceProfile = await freelanceRepository.findByUserId(userId);
        if (!freelanceProfile) {
            throw new AppError_1.AppError('Freelance profile required to apply to missions', 400);
        }
        const { MissionRepository } = await Promise.resolve().then(() => __importStar(require('../mission/repository/mission.repository')));
        const missionRepository = new MissionRepository();
        const mission = await missionRepository.findById(data.missionId);
        if (!mission) {
            throw new AppError_1.AppError('Mission not found', 404);
        }
        if (mission.status !== 'OPEN') {
            throw new AppError_1.AppError('Mission is not open for applications', 400);
        }
        return this.applicationRepository.create({
            ...data,
            freelancerId: userId,
        });
    }
    async getApplication(id) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new AppError_1.AppError('Application not found', 404);
        }
        return application;
    }
    async updateApplication(id, userId, data) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new AppError_1.AppError('Application not found', 404);
        }
        if (application.freelancerId !== userId && application.companyId !== userId) {
            throw new AppError_1.AppError('Not authorized to update this application', 403);
        }
        if (application.freelancerId !== userId && (data.proposal || data.proposedRate)) {
            throw new AppError_1.AppError('Only freelancer can update proposal and rate', 403);
        }
        if (application.companyId !== userId && data.status) {
            throw new AppError_1.AppError('Only company can update application status', 403);
        }
        if (data.proposal !== undefined && !data.proposal.trim()) {
            throw new AppError_1.AppError('Proposal cannot be empty', 400);
        }
        if (data.proposedRate !== undefined && data.proposedRate <= 0) {
            throw new AppError_1.AppError('Proposed rate must be positive', 400);
        }
        return this.applicationRepository.update(id, data);
    }
    async deleteApplication(id, userId) {
        const application = await this.applicationRepository.findById(id);
        if (!application) {
            throw new AppError_1.AppError('Application not found', 404);
        }
        if (application.freelancerId !== userId) {
            throw new AppError_1.AppError('Not authorized to delete this application', 403);
        }
        await this.applicationRepository.delete(id);
    }
    async getUserApplications(userId) {
        const { FreelanceRepository } = await Promise.resolve().then(() => __importStar(require('../freelance/repository/freelance.repository')));
        const { CompanyRepository } = await Promise.resolve().then(() => __importStar(require('../company/repository/company.repository')));
        const freelanceRepository = new FreelanceRepository();
        const companyRepository = new CompanyRepository();
        const freelanceProfile = await freelanceRepository.findByUserId(userId);
        const companyProfile = await companyRepository.findByUserId(userId);
        if (freelanceProfile) {
            return this.applicationRepository.findByFreelancerId(userId);
        }
        else if (companyProfile) {
            return this.applicationRepository.findByCompanyId(userId);
        }
        else {
            throw new AppError_1.AppError('User profile not found', 404);
        }
    }
    async getMissionApplications(missionId, userId) {
        const { MissionRepository } = await Promise.resolve().then(() => __importStar(require('../mission/repository/mission.repository')));
        const missionRepository = new MissionRepository();
        const mission = await missionRepository.findById(missionId);
        if (!mission) {
            throw new AppError_1.AppError('Mission not found', 404);
        }
        const { CompanyRepository } = await Promise.resolve().then(() => __importStar(require('../company/repository/company.repository')));
        const companyRepository = new CompanyRepository();
        const companyProfile = await companyRepository.findByUserId(userId);
        if (!companyProfile || mission.companyId !== companyProfile.id) {
            throw new AppError_1.AppError('Not authorized to view applications for this mission', 403);
        }
        return this.applicationRepository.findByMissionId(missionId);
    }
    async searchApplications(filters) {
        return this.applicationRepository.findMany(filters);
    }
}
exports.ApplicationService = ApplicationService;
//# sourceMappingURL=application.service.js.map