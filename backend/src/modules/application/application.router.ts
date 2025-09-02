import { Router } from 'express';
import { ApplicationController } from './application.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const applicationController = new ApplicationController();

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create application for a mission
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - missionId
 *               - companyId
 *               - proposal
 *               - proposedRate
 *             properties:
 *               missionId:
 *                 type: string
 *               companyId:
 *                 type: string
 *               proposal:
 *                 type: string
 *               proposedRate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Application created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, applicationController.createApplication);

/**
 * @swagger
 * /applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application retrieved successfully
 *       404:
 *         description: Application not found
 */
router.get('/:id', applicationController.getApplication);

/**
 * @swagger
 * /applications/{id}:
 *   put:
 *     summary: Update application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               proposal:
 *                 type: string
 *               proposedRate:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [PENDING, ACCEPTED, REJECTED, WITHDRAWN]
 *     responses:
 *       200:
 *         description: Application updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Application not found
 */
router.put('/:id', authenticateToken, applicationController.updateApplication);

/**
 * @swagger
 * /applications/{id}:
 *   delete:
 *     summary: Delete application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Application not found
 */
router.delete('/:id', authenticateToken, applicationController.deleteApplication);

/**
 * @swagger
 * /applications/user/my-applications:
 *   get:
 *     summary: Get user's applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User applications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User profile not found
 */
router.get('/user/my-applications', authenticateToken, applicationController.getUserApplications);

/**
 * @swagger
 * /applications/mission/{missionId}:
 *   get:
 *     summary: Get applications for a specific mission
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Mission applications retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Mission not found
 */
router.get('/mission/:missionId', authenticateToken, applicationController.getMissionApplications);

/**
 * @swagger
 * /applications/search:
 *   get:
 *     summary: Search applications
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: missionId
 *         schema:
 *           type: string
 *         description: Mission ID filter
 *       - in: query
 *         name: freelancerId
 *         schema:
 *           type: string
 *         description: Freelancer ID filter
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: Company ID filter
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, WITHDRAWN]
 *         description: Status filter
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 */
router.get('/search', applicationController.searchApplications);

export default router; 
