const express = require('express');
const maintenanceController = require('../controllers/maintenance.controller');
const {
  validateMaintenanceId,
  validateCreateMaintenance,
  validateUpdateMaintenance,
} = require('../validators/maintenance.validator');

const router = express.Router();

router.get('/', maintenanceController.getAllMaintenances);
router.post('/', validateCreateMaintenance, maintenanceController.createMaintenance);
router.get('/:id', validateMaintenanceId, maintenanceController.getMaintenanceById);
router.put('/:id', validateMaintenanceId, validateUpdateMaintenance, maintenanceController.updateMaintenance);
router.delete('/:id', validateMaintenanceId, maintenanceController.deleteMaintenance);

module.exports = router;
