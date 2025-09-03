"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FreelanceController = void 0;
const freelance_service_1 = require("../service/freelance.service");
const response_1 = require("../../../utils/response");
class FreelanceController {
    constructor() {
        this.createProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const profile = await this.freelanceService.createProfile(userId, req.body);
                response_1.ResponseUtil.created(res, profile, 'Freelance profile created successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const profile = await this.freelanceService.getProfile(userId);
                response_1.ResponseUtil.success(res, profile, 'Freelance profile retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const profile = await this.freelanceService.updateProfile(userId, req.body);
                response_1.ResponseUtil.success(res, profile, 'Freelance profile updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                await this.freelanceService.deleteProfile(userId);
                response_1.ResponseUtil.success(res, null, 'Freelance profile deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchFreelancers = async (req, res, next) => {
            try {
                const filters = req.query;
                const freelancers = await this.freelanceService.searchFreelancers({
                    skills: filters.skills ? filters.skills.split(',') : undefined,
                    minRate: filters.minRate ? Number(filters.minRate) : undefined,
                    maxRate: filters.maxRate ? Number(filters.maxRate) : undefined,
                    location: filters.location,
                    minExperience: filters.minExperience ? Number(filters.minExperience) : undefined,
                });
                response_1.ResponseUtil.success(res, freelancers, 'Freelancers retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getRecommendedMissions = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const missions = await this.freelanceService.getRecommendedMissions(userId);
                response_1.ResponseUtil.success(res, missions, 'Recommended missions retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.freelanceService = new freelance_service_1.FreelanceService();
    }
}
exports.FreelanceController = FreelanceController;
//# sourceMappingURL=freelance.controller.js.map