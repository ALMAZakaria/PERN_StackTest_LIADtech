import { Router } from 'express';
import { SkillsController } from './skills.controller';

const router = Router();
const skillsController = new SkillsController();

/**
 * @swagger
 * /skills:
 *   get:
 *     summary: Get all predefined skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: All skills retrieved successfully
 */
router.get('/', skillsController.getAllSkills);

/**
 * @swagger
 * /skills/search:
 *   get:
 *     summary: Search skills with autocomplete
 *     tags: [Skills]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results
 *     responses:
 *       200:
 *         description: Skills search completed successfully
 */
router.get('/search', skillsController.searchSkills);

/**
 * @swagger
 * /skills/validate:
 *   post:
 *     summary: Validate skills against predefined list
 *     tags: [Skills]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skills
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Skills validation completed
 *       400:
 *         description: Invalid request body
 */
router.post('/validate', skillsController.validateSkills);

/**
 * @swagger
 * /skills/categories:
 *   get:
 *     summary: Get skill categories
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Skill categories retrieved successfully
 */
router.get('/categories', skillsController.getSkillCategories);

/**
 * @swagger
 * /skills/popular:
 *   get:
 *     summary: Get popular skills
 *     tags: [Skills]
 *     responses:
 *       200:
 *         description: Popular skills retrieved successfully
 */
router.get('/popular', skillsController.getPopularSkills);

export default router;
