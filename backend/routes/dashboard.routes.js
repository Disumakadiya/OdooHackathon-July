import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";

const router = Router();

router.get("/kpis", dashboardController.getKpis);
router.get("/activities", dashboardController.getActivities);
router.get("/utilization", dashboardController.getUtilization);
router.get("/departments", dashboardController.getDepartmentAssets);
router.get("/maintenance-cost", dashboardController.getMaintenanceCost);
router.get("/bookings", dashboardController.getBookingStats);
router.get("/audit-completion", dashboardController.getAuditCompletion);

export default router;
