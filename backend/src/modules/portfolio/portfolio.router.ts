import { Router } from 'express';
import { PortfolioController } from './portfolio.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const portfolioController = new PortfolioController();

/**
 * @swagger
 * /portfolio:
 *   post:
 *     summary: Create portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - technologies
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageUrl:
 *                 type: string
 *               projectUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, portfolioController.createProject);

/**
 * @swagger
 * /portfolio/{id}:
 *   get:
 *     summary: Get portfolio project by ID
 *     tags: [Portfolio]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project retrieved successfully
 *       404:
 *         description: Project not found
 */
router.get('/:id', portfolioController.getProject);

/**
 * @swagger
 * /portfolio/{id}:
 *   put:
 *     summary: Update portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               technologies:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageUrl:
 *                 type: string
 *               projectUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */
router.put('/:id', authenticateToken, portfolioController.updateProject);

/**
 * @swagger
 * /portfolio/{id}:
 *   delete:
 *     summary: Delete portfolio project
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Project ID
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Project not found
 */
router.delete('/:id', authenticateToken, portfolioController.deleteProject);

/**
 * @swagger
 * /portfolio/user/my-portfolio:
 *   get:
 *     summary: Get user's portfolio
 *     tags: [Portfolio]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User portfolio retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Freelance profile not found
 */
router.get('/user/my-portfolio', authenticateToken, portfolioController.getUserPortfolio);

/**
 * @swagger
 * /portfolio/search:
 *   get:
 *     summary: Search portfolios
 *     tags: [Portfolio]
 *     parameters:
 *       - in: query
 *         name: technologies
 *         schema:
 *           type: string
 *         description: Comma-separated technologies
 *       - in: query
 *         name: freelancerId
 *         schema:
 *           type: string
 *         description: Freelancer ID filter
 *     responses:
 *       200:
 *         description: Portfolios retrieved successfully
 */
router.get('/search', portfolioController.searchPortfolios);

export default router;
