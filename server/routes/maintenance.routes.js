import express from "express";
import * as maintenanceController from "../controllers/maintenance.controller.js";
import { 
  validateMaintenanceId,
  validateCreateMaintenance,
  validateUpdateMaintenance,
 } from "../validators/maintenance.validator.js";

const router = express.Router();

router.get('/', maintenanceController.getAllMaintenances);
router.post('/', validateCreateMaintenance, maintenanceController.createMaintenance);
router.get('/:id', validateMaintenanceId, maintenanceController.getMaintenanceById);
router.put('/:id', validateMaintenanceId, validateUpdateMaintenance, maintenanceController.updateMaintenance);
router.delete('/:id', validateMaintenanceId, maintenanceController.deleteMaintenance);

// Workflow transitions
router.patch('/:id/approve', validateMaintenanceId, maintenanceController.approveMaintenance);
router.patch('/:id/reject', validateMaintenanceId, maintenanceController.rejectMaintenance);
router.patch('/:id/assign', validateMaintenanceId, maintenanceController.assignTechnician);
router.patch('/:id/start', validateMaintenanceId, maintenanceController.startMaintenance);
router.patch('/:id/resolve', validateMaintenanceId, maintenanceController.resolveMaintenance);

export default router;
