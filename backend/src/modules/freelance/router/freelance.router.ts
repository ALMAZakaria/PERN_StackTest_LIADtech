import { Router } from 'express';
import { FreelanceController } from '../controller/freelance.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();
const freelanceController = new FreelanceController();

/**
 * @swagger
 * /freelance/profile:
 *   post:
 *     summary: Create freelance profile
 *     tags: [Freelance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - skills
 *               - dailyRate
 *               - availability
 *               - experience
 *             properties:
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               dailyRate:
 *                 type: number
 *               availability:
 *                 type: number
 *               location:
 *                 type: string
 *               experience:
 *                 type: number
 *     responses:
 *       201:
 *         description: Profile created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/profile', authenticateToken, freelanceController.createProfile);

/**
 * @swagger
 * /freelance/profile:
 *   get:
 *     summary: Get freelance profile
 *     tags: [Freelance]
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
router.get('/profile', authenticateToken, freelanceController.getProfile);

/**
 * @swagger
 * /freelance/profile:
 *   put:
 *     summary: Update freelance profile
 *     tags: [Freelance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               bio:
 *                 type: string
 *               skills:
 *                 type: array
 *                 items:
 *                   type: string
 *               dailyRate:
 *                 type: number
 *               availability:
 *                 type: number
 *               location:
 *                 type: string
 *               experience:
 *                 type: number
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
router.put('/profile', authenticateToken, freelanceController.updateProfile);

/**
 * @swagger
 * /freelance/profile:
 *   delete:
 *     summary: Delete freelance profile
 *     tags: [Freelance]
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
router.delete('/profile', authenticateToken, freelanceController.deleteProfile);

/**
 * @swagger
 * /freelance/search:
 *   get:
 *     summary: Search freelancers
 *     tags: [Freelance]
 *     parameters:
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated skills
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Minimum daily rate
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Maximum daily rate
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *       - in: query
 *         name: minExperience
 *         schema:
 *           type: number
 *         description: Minimum years of experience
 *     responses:
 *       200:
 *         description: Freelancers retrieved successfully
 */
router.get('/search', freelanceController.searchFreelancers);

/**
 * @swagger
 * /freelance/recommended-missions:
 *   get:
 *     summary: Get recommended missions for freelancer
 *     tags: [Freelance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Recommended missions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Profile not found
 */
router.get('/recommended-missions', authenticateToken, freelanceController.getRecommendedMissions);

export default router;
