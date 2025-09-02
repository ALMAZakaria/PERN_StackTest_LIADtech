"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationController = void 0;
const application_service_1 = require("./application.service");
const response_1 = require("../../utils/response");
class ApplicationController {
    constructor() {
        this.createApplication = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const application = await this.applicationService.createApplication(userId, req.body);
                response_1.ResponseUtil.created(res, application, 'Application submitted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getApplication = async (req, res, next) => {
            try {
                const { id } = req.params;
                const application = await this.applicationService.getApplication(id);
                response_1.ResponseUtil.success(res, application, 'Application retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateApplication = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const application = await this.applicationService.updateApplication(id, userId, req.body);
                response_1.ResponseUtil.success(res, application, 'Application updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteApplication = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                await this.applicationService.deleteApplication(id, userId);
                response_1.ResponseUtil.success(res, null, 'Application deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserApplications = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const applications = await this.applicationService.getUserApplications(userId);
                response_1.ResponseUtil.success(res, applications, 'User applications retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getMissionApplications = async (req, res, next) => {
            try {
                const { missionId } = req.params;
                const userId = req.user.id;
                const applications = await this.applicationService.getMissionApplications(missionId, userId);
                response_1.ResponseUtil.success(res, applications, 'Mission applications retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchApplications = async (req, res, next) => {
            try {
                const filters = req.query;
                const applications = await this.applicationService.searchApplications({
                    missionId: filters.missionId,
                    freelancerId: filters.freelancerId,
                    companyId: filters.companyId,
                    status: filters.status,
                });
                response_1.ResponseUtil.success(res, applications, 'Applications retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.applicationService = new application_service_1.ApplicationService();
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map