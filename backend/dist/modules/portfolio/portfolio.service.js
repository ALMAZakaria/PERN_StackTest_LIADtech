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
exports.PortfolioService = void 0;
const portfolio_repository_1 = require("./portfolio.repository");
const AppError_1 = require("../../utils/AppError");
class PortfolioService {
    constructor() {
        this.portfolioRepository = new portfolio_repository_1.PortfolioRepository();
    }
    async createProject(userId, data) {
        if (!data.title.trim()) {
            throw new AppError_1.AppError('Project title is required', 400);
        }
        if (!data.description.trim()) {
            throw new AppError_1.AppError('Project description is required', 400);
        }
        if (data.technologies.length === 0) {
            throw new AppError_1.AppError('At least one technology is required', 400);
        }
        const { FreelanceRepository } = await Promise.resolve().then(() => __importStar(require('../freelance/repository/freelance.repository')));
        const freelanceRepository = new FreelanceRepository();
        const freelanceProfile = await freelanceRepository.findByUserId(userId);
        if (!freelanceProfile) {
            throw new AppError_1.AppError('Freelance profile required to create portfolio projects', 400);
        }
        return this.portfolioRepository.create({
            ...data,
            freelancerId: freelanceProfile.id,
        });
    }
    async getProject(id) {
        const project = await this.portfolioRepository.findById(id);
        if (!project) {
            throw new AppError_1.AppError('Portfolio project not found', 404);
        }
        return project;
    }
    async updateProject(id, userId, data) {
        const project = await this.portfolioRepository.findById(id);
        if (!project) {
            throw new AppError_1.AppError('Portfolio project not found', 404);
        }
        const { FreelanceRepository } = await Promise.resolve().then(() => __importStar(require('../freelance/repository/freelance.repository')));
        const freelanceRepository = new FreelanceRepository();
        const freelanceProfile = await freelanceRepository.findByUserId(userId);
        if (!freelanceProfile || project.freelancerId !== freelanceProfile.id) {
            throw new AppError_1.AppError('Not authorized to update this project', 403);
        }
        if (data.title !== undefined && !data.title.trim()) {
            throw new AppError_1.AppError('Project title cannot be empty', 400);
        }
        if (data.description !== undefined && !data.description.trim()) {
            throw new AppError_1.AppError('Project description cannot be empty', 400);
        }
        if (data.technologies !== undefined && data.technologies.length === 0) {
            throw new AppError_1.AppError('At least one technology is required', 400);
        }
        return this.portfolioRepository.update(id, data);
    }
    async deleteProject(id, userId) {
        const project = await this.portfolioRepository.findById(id);
        if (!project) {
            throw new AppError_1.AppError('Portfolio project not found', 404);
        }
        const { FreelanceRepository } = await Promise.resolve().then(() => __importStar(require('../freelance/repository/freelance.repository')));
        const freelanceRepository = new FreelanceRepository();
        const freelanceProfile = await freelanceRepository.findByUserId(userId);
        if (!freelanceProfile || project.freelancerId !== freelanceProfile.id) {
            throw new AppError_1.AppError('Not authorized to delete this project', 403);
        }
        await this.portfolioRepository.delete(id);
    }
    async getUserPortfolio(userId) {
        const { FreelanceRepository } = await Promise.resolve().then(() => __importStar(require('../freelance/repository/freelance.repository')));
        const freelanceRepository = new FreelanceRepository();
        const freelanceProfile = await freelanceRepository.findByUserId(userId);
        if (!freelanceProfile) {
            throw new AppError_1.AppError('Freelance profile not found', 404);
        }
        return this.portfolioRepository.findByFreelancerId(freelanceProfile.id);
    }
    async searchPortfolios(filters) {
        return this.portfolioRepository.findMany(filters);
    }
}
exports.PortfolioService = PortfolioService;
//# sourceMappingURL=portfolio.service.js.map