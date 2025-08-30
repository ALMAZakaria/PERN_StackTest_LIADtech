"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MissionController = void 0;
const mission_service_1 = require("../service/mission.service");
const response_1 = require("../../../utils/response");
class MissionController {
    constructor() {
        this.createMission = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const mission = await this.missionService.createMission(userId, req.body);
                response_1.ResponseUtil.created(res, mission, 'Mission created successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getMission = async (req, res, next) => {
            try {
                const { id } = req.params;
                const mission = await this.missionService.getMission(id);
                response_1.ResponseUtil.success(res, mission, 'Mission retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateMission = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const mission = await this.missionService.updateMission(id, userId, req.body);
                response_1.ResponseUtil.success(res, mission, 'Mission updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteMission = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                await this.missionService.deleteMission(id, userId);
                response_1.ResponseUtil.success(res, null, 'Mission deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchMissions = async (req, res, next) => {
            try {
                const filters = req.query;
                const missions = await this.missionService.searchMissions({
                    status: filters.status,
                    skills: filters.skills ? filters.skills.split(',') : undefined,
                    minBudget: filters.minBudget ? Number(filters.minBudget) : undefined,
                    maxBudget: filters.maxBudget ? Number(filters.maxBudget) : undefined,
                    location: filters.location,
                    isRemote: filters.isRemote ? filters.isRemote === 'true' : undefined,
                });
                response_1.ResponseUtil.success(res, missions, 'Missions retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getCompanyMissions = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const missions = await this.missionService.getCompanyMissions(userId);
                response_1.ResponseUtil.success(res, missions, 'Company missions retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getRecommendedFreelancers = async (req, res, next) => {
            try {
                const { missionId } = req.params;
                const freelancers = await this.missionService.getRecommendedFreelancers(missionId);
                response_1.ResponseUtil.success(res, freelancers, 'Recommended freelancers retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.missionService = new mission_service_1.MissionService();
    }
}
exports.MissionController = MissionController;
//# sourceMappingURL=mission.controller.js.map