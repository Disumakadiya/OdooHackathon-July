import express from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get('/kpis', dashboardController.getKpis);
router.get('/activities', dashboardController.getRecentActivities);
router.get('/quick-actions', dashboardController.getQuickActions);
router.get('/utilization', dashboardController.getAssetUtilization);
router.get('/departments', dashboardController.getDepartmentWiseAssets);
router.get('/maintenance-cost', dashboardController.getMaintenanceCost);
router.get('/bookings', dashboardController.getBookingStatistics);
router.get('/audit-completion', dashboardController.getAuditCompletion);

export default router;
