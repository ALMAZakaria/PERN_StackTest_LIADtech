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
exports.FreelanceService = void 0;
const freelance_repository_1 = require("../repository/freelance.repository");
const AppError_1 = require("../../../utils/AppError");
class FreelanceService {
    constructor() {
        this.freelanceRepository = new freelance_repository_1.FreelanceRepository();
    }
    async createProfile(userId, data) {
        try {
            const existingProfile = await this.freelanceRepository.findByUserId(userId);
            if (existingProfile) {
                throw new AppError_1.AppError('Freelance profile already exists for this user', 400);
            }
            if (data.dailyRate <= 0) {
                throw new AppError_1.AppError('Daily rate must be greater than 0', 400);
            }
            if (data.availability <= 0 || data.availability > 168) {
                throw new AppError_1.AppError('Availability must be between 1 and 168 hours per week', 400);
            }
            if (data.experience < 0) {
                throw new AppError_1.AppError('Experience cannot be negative', 400);
            }
            return this.freelanceRepository.create({
                ...data,
                userId,
            });
        }
        catch (error) {
            if (error.code === 'P2002' && error.meta?.target?.includes('userId')) {
                throw new AppError_1.AppError('Freelance profile already exists for this user', 400);
            }
            if (error instanceof AppError_1.AppError) {
                throw error;
            }
            if (error.code === 'P2002') {
                throw new AppError_1.AppError('A profile with this information already exists', 400);
            }
            console.error('Unexpected error in createProfile:', error);
            throw new AppError_1.AppError('Failed to create freelance profile', 500);
        }
    }
    async getProfile(userId) {
        const profile = await this.freelanceRepository.findByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError('Freelance profile not found', 404);
        }
        return profile;
    }
    async updateProfile(userId, data) {
        const existingProfile = await this.freelanceRepository.findByUserId(userId);
        if (!existingProfile) {
            throw new AppError_1.AppError('Freelance profile not found', 404);
        }
        if (data.dailyRate !== undefined && data.dailyRate <= 0) {
            throw new AppError_1.AppError('Daily rate must be greater than 0', 400);
        }
        if (data.availability !== undefined && (data.availability <= 0 || data.availability > 168)) {
            throw new AppError_1.AppError('Availability must be between 1 and 168 hours per week', 400);
        }
        if (data.experience !== undefined && data.experience < 0) {
            throw new AppError_1.AppError('Experience cannot be negative', 400);
        }
        return this.freelanceRepository.update(userId, data);
    }
    async deleteProfile(userId) {
        const existingProfile = await this.freelanceRepository.findByUserId(userId);
        if (!existingProfile) {
            throw new AppError_1.AppError('Freelance profile not found', 404);
        }
        await this.freelanceRepository.delete(userId);
    }
    async searchFreelancers(filters) {
        return this.freelanceRepository.findMany(filters);
    }
    async getRecommendedMissions(userId) {
        const profile = await this.freelanceRepository.findByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError('Freelance profile not found', 404);
        }
        const { MissionRepository } = await Promise.resolve().then(() => __importStar(require('../../mission/repository/mission.repository')));
        const missionRepository = new MissionRepository();
        return missionRepository.findMany({
            status: 'OPEN',
            skills: profile.skills,
        });
    }
}
exports.FreelanceService = FreelanceService;
//# sourceMappingURL=freelance.service.js.map