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
 *               - proposal
 *               - proposedRate
 *             properties:
 *               missionId:
 *                 type: string
 *               proposal:
 *                 type: string
 *               proposedRate:
 *                 type: number
 *               estimatedDuration:
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

/**
 * @swagger
 * /applications/user/my-applications/paginated:
 *   get:
 *     summary: Get user's applications with pagination and filtering
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, proposedRate, estimatedDuration, status]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, WITHDRAWN]
 *         description: Filter by status
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Minimum proposed rate
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Maximum proposed rate
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Minimum estimated duration
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum estimated duration
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *     responses:
 *       200:
 *         description: User applications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user/my-applications/paginated', authenticateToken, applicationController.getUserApplicationsWithPagination);

/**
 * @swagger
 * /applications/mission/{missionId}/paginated:
 *   get:
 *     summary: Get applications for a specific mission with pagination and filtering
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
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, proposedRate, estimatedDuration, status]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, ACCEPTED, REJECTED, WITHDRAWN]
 *         description: Filter by status
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Minimum proposed rate
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Maximum proposed rate
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Minimum estimated duration
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum estimated duration
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
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
router.get('/mission/:missionId/paginated', authenticateToken, applicationController.getMissionApplicationsWithPagination);

/**
 * @swagger
 * /applications/search/paginated:
 *   get:
 *     summary: Search applications with pagination and filtering
 *     tags: [Applications]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, proposedRate, estimatedDuration, status]
 *         description: Sort field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
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
 *       - in: query
 *         name: minRate
 *         schema:
 *           type: number
 *         description: Minimum proposed rate
 *       - in: query
 *         name: maxRate
 *         schema:
 *           type: number
 *         description: Maximum proposed rate
 *       - in: query
 *         name: minDuration
 *         schema:
 *           type: integer
 *         description: Minimum estimated duration
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum estimated duration
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter from date
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter to date
 *     responses:
 *       200:
 *         description: Applications retrieved successfully
 */
router.get('/search/paginated', applicationController.searchApplicationsWithPagination);

/**
 * @swagger
 * /applications/stats:
 *   get:
 *     summary: Get application statistics for the current user
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Application statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/stats', authenticateToken, applicationController.getApplicationStats);

export default router; 
