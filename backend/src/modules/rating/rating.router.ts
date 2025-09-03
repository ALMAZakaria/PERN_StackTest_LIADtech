import { Router } from 'express';
import { RatingController } from './rating.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const ratingController = new RatingController();

/**
 * @swagger
 * /ratings:
 *   post:
 *     summary: Create a rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - applicationId
 *               - rating
 *               - toUserId
 *             properties:
 *               applicationId:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *               toUserId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Rating created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authenticateToken, ratingController.createRating);

/**
 * @swagger
 * /ratings/{id}:
 *   get:
 *     summary: Get rating by ID
 *     tags: [Ratings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Rating retrieved successfully
 *       404:
 *         description: Rating not found
 */
router.get('/:id', ratingController.getRating);

/**
 * @swagger
 * /ratings/{id}:
 *   put:
 *     summary: Update rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Rating not found
 */
router.put('/:id', authenticateToken, ratingController.updateRating);

/**
 * @swagger
 * /ratings/{id}:
 *   delete:
 *     summary: Delete rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Rating ID
 *     responses:
 *       200:
 *         description: Rating deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Rating not found
 */
router.delete('/:id', authenticateToken, ratingController.deleteRating);

/**
 * @swagger
 * /ratings/user/my-ratings:
 *   get:
 *     summary: Get user's ratings
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User ratings retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user/my-ratings', authenticateToken, ratingController.getUserRatings);

/**
 * @swagger
 * /ratings/user/average:
 *   get:
 *     summary: Get user's average rating
 *     tags: [Ratings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User average rating retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/user/average', authenticateToken, ratingController.getUserAverageRating);

/**
 * @swagger
 * /ratings/search:
 *   get:
 *     summary: Search ratings
 *     tags: [Ratings]
 *     parameters:
 *       - in: query
 *         name: fromUserId
 *         schema:
 *           type: string
 *         description: User who gave the rating
 *       - in: query
 *         name: toUserId
 *         schema:
 *           type: string
 *         description: User who received the rating
 *       - in: query
 *         name: applicationId
 *         schema:
 *           type: string
 *         description: Application ID filter
 *     responses:
 *       200:
 *         description: Ratings retrieved successfully
 */
router.get('/search', ratingController.searchRatings);

export default router; 
