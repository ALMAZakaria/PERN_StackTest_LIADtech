import { Router } from 'express';
import { MissionController } from '../controller/mission.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();
const missionController = new MissionController();

/**
 * @swagger
 * /missions:
 *   post:
 *     summary: Create a new mission
 *     tags: [Missions]
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
 *               - requiredSkills
 *               - budget
 *               - duration
 *               - isRemote
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               budget:
 *                 type: number
 *               duration:
 *                 type: number
 *               location:
 *                 type: string
 *               isRemote:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Mission created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, missionController.createMission);

/**
 * @swagger
 * /missions:
 *   get:
 *     summary: Search missions
 *     tags: [Missions]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [OPEN, IN_PROGRESS, COMPLETED, CANCELLED]
 *         description: Mission status filter
 *       - in: query
 *         name: skills
 *         schema:
 *           type: string
 *         description: Comma-separated skills
 *       - in: query
 *         name: minBudget
 *         schema:
 *           type: number
 *         description: Minimum budget
 *       - in: query
 *         name: maxBudget
 *         schema:
 *           type: number
 *         description: Maximum budget
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Location filter
 *       - in: query
 *         name: isRemote
 *         schema:
 *           type: boolean
 *         description: Remote work filter
 *     responses:
 *       200:
 *         description: Missions retrieved successfully
 */
router.get('/', missionController.searchMissions);

/**
 * @swagger
 * /missions/{id}:
 *   get:
 *     summary: Get mission by ID
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Mission retrieved successfully
 *       404:
 *         description: Mission not found
 */
router.get('/:id', missionController.getMission);

/**
 * @swagger
 * /missions/{id}:
 *   put:
 *     summary: Update mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
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
 *               requiredSkills:
 *                 type: array
 *                 items:
 *                   type: string
 *               budget:
 *                 type: number
 *               duration:
 *                 type: number
 *               location:
 *                 type: string
 *               isRemote:
 *                 type: boolean
 *               status:
 *                 type: string
 *                 enum: [OPEN, IN_PROGRESS, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Mission updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Mission not found
 */
router.put('/:id', authenticateToken, missionController.updateMission);

/**
 * @swagger
 * /missions/{id}:
 *   delete:
 *     summary: Delete mission
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Mission deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Mission not found
 */
router.delete('/:id', authenticateToken, missionController.deleteMission);

/**
 * @swagger
 * /missions/company/my-missions:
 *   get:
 *     summary: Get company's missions
 *     tags: [Missions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Company missions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Company profile not found
 */
router.get('/company/my-missions', authenticateToken, missionController.getCompanyMissions);

/**
 * @swagger
 * /missions/{missionId}/recommended-freelancers:
 *   get:
 *     summary: Get recommended freelancers for a mission
 *     tags: [Missions]
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: string
 *         description: Mission ID
 *     responses:
 *       200:
 *         description: Recommended freelancers retrieved successfully
 *       404:
 *         description: Mission not found
 */
router.get('/:missionId/recommended-freelancers', missionController.getRecommendedFreelancers);

export default router;
