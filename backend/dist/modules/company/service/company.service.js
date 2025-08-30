"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyService = void 0;
const company_repository_1 = require("../repository/company.repository");
const AppError_1 = require("../../../utils/AppError");
class CompanyService {
    constructor() {
        this.companyRepository = new company_repository_1.CompanyRepository();
    }
    async createProfile(userId, data) {
        const existingProfile = await this.companyRepository.findByUserId(userId);
        if (existingProfile) {
            throw new AppError_1.AppError('Company profile already exists for this user', 400);
        }
        if (!data.companyName.trim()) {
            throw new AppError_1.AppError('Company name is required', 400);
        }
        if (!data.industry.trim()) {
            throw new AppError_1.AppError('Industry is required', 400);
        }
        return this.companyRepository.create({
            ...data,
            userId,
        });
    }
    async getProfile(userId) {
        const profile = await this.companyRepository.findByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError('Company profile not found', 404);
        }
        return profile;
    }
    async updateProfile(userId, data) {
        const existingProfile = await this.companyRepository.findByUserId(userId);
        if (!existingProfile) {
            throw new AppError_1.AppError('Company profile not found', 404);
        }
        if (data.companyName !== undefined && !data.companyName.trim()) {
            throw new AppError_1.AppError('Company name cannot be empty', 400);
        }
        if (data.industry !== undefined && !data.industry.trim()) {
            throw new AppError_1.AppError('Industry cannot be empty', 400);
        }
        return this.companyRepository.update(userId, data);
    }
    async deleteProfile(userId) {
        const existingProfile = await this.companyRepository.findByUserId(userId);
        if (!existingProfile) {
            throw new AppError_1.AppError('Company profile not found', 404);
        }
        await this.companyRepository.delete(userId);
    }
    async searchCompanies(filters) {
        return this.companyRepository.findMany(filters);
    }
    async getCompanyStats(userId) {
        const profile = await this.companyRepository.findByUserId(userId);
        if (!profile) {
            throw new AppError_1.AppError('Company profile not found', 404);
        }
        return {
            totalMissions: 0,
            openMissions: 0,
            totalApplications: 0,
            averageApplicationsPerMission: 0,
        };
    }
}
exports.CompanyService = CompanyService;
//# sourceMappingURL=company.service.js.map