import express from "express";
import * as notificationController from "../controllers/notification.controller.js";

const router = express.Router();

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.markAllRead);
router.patch('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);


export default router;
