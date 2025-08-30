import { Router } from 'express';
import { CompanyController } from '../controller/company.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();
const companyController = new CompanyController();

/**
 * @swagger
 * /company/profile:
 *   post:
 *     summary: Create company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyName
 *               - industry
 *               - size
 *             properties:
 *               companyName:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE]
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/profile', authenticateToken, companyController.createProfile);

/**
 * @swagger
 * /company/profile:
 *   get:
 *     summary: Get company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       404:
 *         description: Profile not found
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', authenticateToken, companyController.getProfile);

/**
 * @swagger
 * /company/profile:
 *   put:
 *     summary: Update company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyName:
 *                 type: string
 *               industry:
 *                 type: string
 *               size:
 *                 type: string
 *                 enum: [STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE]
 *               description:
 *                 type: string
 *               website:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.put('/profile', authenticateToken, companyController.updateProfile);

/**
 * @swagger
 * /company/profile:
 *   delete:
 *     summary: Delete company profile
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.delete('/profile', authenticateToken, companyController.deleteProfile);

/**
 * @swagger
 * /company/search:
 *   get:
 *     summary: Search companies
 *     tags: [Company]
 *     parameters:
 *       - in: query
 *         name: industry
 *         schema:
 *           type: string
 *         description: Industry filter
 *       - in: query
 *         name: size
 *         schema:
 *           type: string
 *           enum: [STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE]
 *         description: Company size filter
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *     responses:
 *       200:
 *         description: Companies retrieved successfully
 */
router.get('/search', companyController.searchCompanies);

/**
 * @swagger
 * /company/stats:
 *   get:
 *     summary: Get company statistics
 *     tags: [Company]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get('/stats', authenticateToken, companyController.getCompanyStats);

export default router;
