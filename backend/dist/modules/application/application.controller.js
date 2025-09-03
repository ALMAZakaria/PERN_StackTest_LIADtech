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
        this.getUserApplicationsWithPagination = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const sortBy = req.query.sortBy;
                const sortOrder = req.query.sortOrder;
                const status = req.query.status;
                const minRate = req.query.minRate ? parseFloat(req.query.minRate) : undefined;
                const maxRate = req.query.maxRate ? parseFloat(req.query.maxRate) : undefined;
                const minDuration = req.query.minDuration ? parseInt(req.query.minDuration) : undefined;
                const maxDuration = req.query.maxDuration ? parseInt(req.query.maxDuration) : undefined;
                const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : undefined;
                const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : undefined;
                const filters = {
                    status,
                    minRate,
                    maxRate,
                    minDuration,
                    maxDuration,
                    dateFrom,
                    dateTo,
                };
                const pagination = {
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                };
                const result = await this.applicationService.getUserApplicationsWithPagination(userId, filters, pagination);
                response_1.ResponseUtil.success(res, result, 'User applications retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getMissionApplicationsWithPagination = async (req, res, next) => {
            try {
                const { missionId } = req.params;
                const userId = req.user.id;
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const sortBy = req.query.sortBy;
                const sortOrder = req.query.sortOrder;
                const status = req.query.status;
                const minRate = req.query.minRate ? parseFloat(req.query.minRate) : undefined;
                const maxRate = req.query.maxRate ? parseFloat(req.query.maxRate) : undefined;
                const minDuration = req.query.minDuration ? parseInt(req.query.minDuration) : undefined;
                const maxDuration = req.query.maxDuration ? parseInt(req.query.maxDuration) : undefined;
                const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : undefined;
                const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : undefined;
                const filters = {
                    status,
                    minRate,
                    maxRate,
                    minDuration,
                    maxDuration,
                    dateFrom,
                    dateTo,
                };
                const pagination = {
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                };
                const result = await this.applicationService.getMissionApplicationsWithPagination(missionId, userId, filters, pagination);
                response_1.ResponseUtil.success(res, result, 'Mission applications retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchApplicationsWithPagination = async (req, res, next) => {
            try {
                const page = parseInt(req.query.page) || 1;
                const limit = parseInt(req.query.limit) || 10;
                const sortBy = req.query.sortBy;
                const sortOrder = req.query.sortOrder;
                const missionId = req.query.missionId;
                const freelancerId = req.query.freelancerId;
                const companyId = req.query.companyId;
                const status = req.query.status;
                const minRate = req.query.minRate ? parseFloat(req.query.minRate) : undefined;
                const maxRate = req.query.maxRate ? parseFloat(req.query.maxRate) : undefined;
                const minDuration = req.query.minDuration ? parseInt(req.query.minDuration) : undefined;
                const maxDuration = req.query.maxDuration ? parseInt(req.query.maxDuration) : undefined;
                const dateFrom = req.query.dateFrom ? new Date(req.query.dateFrom) : undefined;
                const dateTo = req.query.dateTo ? new Date(req.query.dateTo) : undefined;
                const filters = {
                    missionId,
                    freelancerId,
                    companyId,
                    status,
                    minRate,
                    maxRate,
                    minDuration,
                    maxDuration,
                    dateFrom,
                    dateTo,
                };
                const pagination = {
                    page,
                    limit,
                    sortBy,
                    sortOrder,
                };
                const result = await this.applicationService.searchApplicationsWithPagination(filters, pagination);
                response_1.ResponseUtil.success(res, result, 'Applications retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getApplicationStats = async (req, res, next) => {
            try {
                console.log('getApplicationStats called with user:', req.user);
                const userId = req.user.id;
                console.log('Getting stats for userId:', userId);
                const stats = await this.applicationService.getApplicationStats(userId);
                console.log('Stats retrieved successfully:', stats);
                response_1.ResponseUtil.success(res, stats, 'Application statistics retrieved successfully');
            }
            catch (error) {
                console.error('Error in getApplicationStats controller:', error);
                next(error);
            }
        };
        this.applicationService = new application_service_1.ApplicationService();
    }
}
exports.ApplicationController = ApplicationController;
//# sourceMappingURL=application.controller.js.map