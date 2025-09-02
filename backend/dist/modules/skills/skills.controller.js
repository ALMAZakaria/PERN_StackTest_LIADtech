"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkillsController = void 0;
const skills_service_1 = require("./skills.service");
const response_1 = require("../../utils/response");
class SkillsController {
    constructor() {
        this.getAllSkills = async (req, res, next) => {
            try {
                const skills = skills_service_1.SkillsService.getAllSkills();
                response_1.ResponseUtil.success(res, skills, 'Skills retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.searchSkills = async (req, res, next) => {
            try {
                const { query, limit } = req.query;
                const searchQuery = query || '';
                const limitNum = limit ? parseInt(limit) : 10;
                const skills = skills_service_1.SkillsService.searchSkills(searchQuery, limitNum);
                response_1.ResponseUtil.success(res, skills, 'Skills search completed successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.validateSkills = async (req, res, next) => {
            try {
                const { skills } = req.body;
                if (!Array.isArray(skills)) {
                    response_1.ResponseUtil.badRequest(res, 'Skills must be an array');
                    return;
                }
                const validation = skills_service_1.SkillsService.validateSkills(skills);
                response_1.ResponseUtil.success(res, validation, 'Skills validation completed');
            }
            catch (error) {
                next(error);
            }
        };
        this.getSkillCategories = async (req, res, next) => {
            try {
                const categories = skills_service_1.SkillsService.getSkillCategories();
                response_1.ResponseUtil.success(res, categories, 'Skill categories retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
        this.getPopularSkills = async (req, res, next) => {
            try {
                const skills = skills_service_1.SkillsService.getPopularSkills();
                response_1.ResponseUtil.success(res, skills, 'Popular skills retrieved successfully');
            }
            catch (error) {
                next(error);
            }
        };
    }
}
exports.SkillsController = SkillsController;
//# sourceMappingURL=skills.controller.js.map