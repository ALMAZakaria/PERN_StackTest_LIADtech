"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioController = void 0;
const portfolio_service_1 = require("./portfolio.service");
const response_1 = require("../../utils/response");
class PortfolioController {
    constructor() {
        this.createProject = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const project = await this.portfolioService.createProject(userId, req.body);
                response_1.ResponseUtil.created(res, project, 'Portfolio project created successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getProject = async (req, res, next) => {
            try {
                const { id } = req.params;
                const project = await this.portfolioService.getProject(id);
                response_1.ResponseUtil.success(res, project, 'Portfolio project retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProject = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                const project = await this.portfolioService.updateProject(id, userId, req.body);
                response_1.ResponseUtil.success(res, project, 'Portfolio project updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteProject = async (req, res, next) => {
            try {
                const { id } = req.params;
                const userId = req.user.id;
                await this.portfolioService.deleteProject(id, userId);
                response_1.ResponseUtil.success(res, null, 'Portfolio project deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getUserPortfolio = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const portfolio = await this.portfolioService.getUserPortfolio(userId);
                response_1.ResponseUtil.success(res, portfolio, 'User portfolio retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchPortfolios = async (req, res, next) => {
            try {
                const filters = req.query;
                const portfolios = await this.portfolioService.searchPortfolios({
                    technologies: filters.technologies ? filters.technologies.split(',') : undefined,
                    freelancerId: filters.freelancerId,
                });
                response_1.ResponseUtil.success(res, portfolios, 'Portfolios retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.portfolioService = new portfolio_service_1.PortfolioService();
    }
}
exports.PortfolioController = PortfolioController;
//# sourceMappingURL=portfolio.controller.js.map