import { Router } from 'express';
import { NotificationController } from './notification.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const notificationController = new NotificationController();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user's notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Maximum number of notifications to return
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/', authenticateToken, notificationController.getUserNotifications);

/**
 * @swagger
 * /notifications/unread-count:
 *   get:
 *     summary: Get unread notification count
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Unread count retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/unread-count', authenticateToken, notificationController.getUnreadCount);

/**
 * @swagger
 * /notifications/{notificationId}/mark-read:
 *   put:
 *     summary: Mark notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.put('/:notificationId/mark-read', authenticateToken, notificationController.markAsRead);

/**
 * @swagger
 * /notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 */
router.put('/mark-all-read', authenticateToken, notificationController.markAllAsRead);

/**
 * @swagger
 * /notifications/{notificationId}:
 *   delete:
 *     summary: Delete notification
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification ID
 *     responses:
 *       200:
 *         description: Notification deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Notification not found
 */
router.delete('/:notificationId', authenticateToken, notificationController.deleteNotification);

/**
 * @swagger
 * /notifications/clear-old:
 *   delete:
 *     summary: Clear old notifications
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: daysOld
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days old to clear
 *     responses:
 *       200:
 *         description: Old notifications cleared successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/clear-old', authenticateToken, notificationController.clearOldNotifications);

export default router; 
