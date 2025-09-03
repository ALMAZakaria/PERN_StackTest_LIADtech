"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skills_controller_1 = require("./skills.controller");
const router = (0, express_1.Router)();
const skillsController = new skills_controller_1.SkillsController();
router.get('/', skillsController.getAllSkills);
router.get('/search', skillsController.searchSkills);
router.post('/validate', skillsController.validateSkills);
router.get('/categories', skillsController.getSkillCategories);
router.get('/popular', skillsController.getPopularSkills);
exports.default = router;
//# sourceMappingURL=skills.router.js.map