import * as maintenanceService from "../services/maintenance.service.js";

export const getAllMaintenances = async (req, res, next) => {
  try {
    const records = await maintenanceService.getAllMaintenances();
    res.status(200).json({ success: true, message: 'Maintenance records retrieved successfully', data: records });
  } catch (error) {
    next(error);
  }
};

export const getMaintenanceById = async (req, res, next) => {
  try {
    const record = await maintenanceService.getMaintenanceById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Maintenance record not found' });
    }

    res.status(200).json({ success: true, message: 'Maintenance record retrieved successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const createMaintenance = async (req, res, next) => {
  try {
    const record = await maintenanceService.createMaintenance(req.body);
    res.status(201).json({ success: true, message: 'Maintenance record created successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const updateMaintenance = async (req, res, next) => {
  try {
    const record = await maintenanceService.updateMaintenance(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Maintenance record updated successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const deleteMaintenance = async (req, res, next) => {
  try {
    await maintenanceService.deleteMaintenance(req.params.id);
    res.status(200).json({ success: true, message: 'Maintenance record deleted successfully' });
  } catch (error) {
    next(error);
  }
};
