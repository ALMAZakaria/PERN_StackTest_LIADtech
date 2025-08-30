"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const company_service_1 = require("../service/company.service");
const response_1 = require("../../../utils/response");
class CompanyController {
    constructor() {
        this.createProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const profile = await this.companyService.createProfile(userId, req.body);
                response_1.ResponseUtil.created(res, profile, 'Company profile created successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const profile = await this.companyService.getProfile(userId);
                response_1.ResponseUtil.success(res, profile, 'Company profile retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.updateProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const profile = await this.companyService.updateProfile(userId, req.body);
                response_1.ResponseUtil.success(res, profile, 'Company profile updated successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.deleteProfile = async (req, res, next) => {
            try {
                const userId = req.user.id;
                await this.companyService.deleteProfile(userId);
                response_1.ResponseUtil.success(res, null, 'Company profile deleted successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchCompanies = async (req, res, next) => {
            try {
                const filters = req.query;
                const companies = await this.companyService.searchCompanies({
                    industry: filters.industry,
                    size: filters.size,
                    location: filters.location,
                });
                response_1.ResponseUtil.success(res, companies, 'Companies retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getCompanyStats = async (req, res, next) => {
            try {
                const userId = req.user.id;
                const stats = await this.companyService.getCompanyStats(userId);
                response_1.ResponseUtil.success(res, stats, 'Company statistics retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.companyService = new company_service_1.CompanyService();
    }
}
exports.CompanyController = CompanyController;
//# sourceMappingURL=company.controller.js.map