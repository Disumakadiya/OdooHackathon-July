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

export default router;
