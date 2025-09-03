"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const dashboard_service_1 = require("../service/dashboard.service");
const response_1 = require("../../../utils/response");
class DashboardController {
    constructor() {
        this.getStatistics = async (req, res, next) => {
            try {
                const stats = await this.dashboardService.getStatistics();
                response_1.ResponseUtil.success(res, stats, 'Dashboard statistics retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getRecentActivity = async (req, res, next) => {
            try {
                const limit = parseInt(req.query.limit) || 10;
                const activities = await this.dashboardService.getRecentActivity(limit);
                response_1.ResponseUtil.success(res, activities, 'Recent activities retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.dashboardService = new dashboard_service_1.DashboardService();
    }
}
exports.DashboardController = DashboardController;
//# sourceMappingURL=dashboard.controller.js.map