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
    const payload = {
      ...req.body,
      requester_id: req.user ? req.user.id : req.body.requester_id
    };
    const record = await maintenanceService.createMaintenance(payload);
    res.status(201).json({ success: true, message: 'Maintenance request created successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const updateMaintenance = async (req, res, next) => {
  try {
    const record = await maintenanceService.updateMaintenance(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Maintenance request updated successfully', data: record });
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

// Transition Endpoints
export const approveMaintenance = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { comment } = req.body;
    const record = await maintenanceService.approveMaintenance(req.params.id, userId, comment);
    res.status(200).json({ success: true, message: 'Maintenance approved successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const rejectMaintenance = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { reason } = req.body;
    const record = await maintenanceService.rejectMaintenance(req.params.id, userId, reason);
    res.status(200).json({ success: true, message: 'Maintenance rejected successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const assignTechnician = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { technician_id } = req.body;
    if (!technician_id) return res.status(400).json({ success: false, message: 'technician_id is required' });
    const record = await maintenanceService.assignTechnician(req.params.id, userId, technician_id);
    res.status(200).json({ success: true, message: 'Technician assigned successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const startMaintenance = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const record = await maintenanceService.startMaintenance(req.params.id, userId);
    res.status(200).json({ success: true, message: 'Maintenance started successfully', data: record });
  } catch (error) {
    next(error);
  }
};

export const resolveMaintenance = async (req, res, next) => {
  try {
    const userId = req.user ? req.user.id : null;
    const { resolution_notes } = req.body;
    const record = await maintenanceService.resolveMaintenance(req.params.id, userId, resolution_notes);
    res.status(200).json({ success: true, message: 'Maintenance resolved successfully', data: record });
  } catch (error) {
    next(error);
  }
};
