"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const portfolio_controller_1 = require("./portfolio.controller");
const auth_middleware_1 = require("../../middleware/auth.middleware");
const router = (0, express_1.Router)();
const portfolioController = new portfolio_controller_1.PortfolioController();
router.post('/', auth_middleware_1.authenticateToken, portfolioController.createProject);
router.get('/:id', portfolioController.getProject);
router.put('/:id', auth_middleware_1.authenticateToken, portfolioController.updateProject);
router.delete('/:id', auth_middleware_1.authenticateToken, portfolioController.deleteProject);
router.get('/user/my-portfolio', auth_middleware_1.authenticateToken, portfolioController.getUserPortfolio);
router.get('/search', portfolioController.searchPortfolios);
exports.default = router;
//# sourceMappingURL=portfolio.router.js.map