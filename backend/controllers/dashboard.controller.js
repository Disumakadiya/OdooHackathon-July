import * as dashboardService from "../services/dashboard.service.js";

export async function getKpis(req, res, next) {
  try {
    const data = await dashboardService.getKpis();
    res.json({ success: true, message: "Dashboard KPIs retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getActivities(req, res, next) {
  try {
    const data = await dashboardService.getActivities();
    res.json({ success: true, message: "Activities retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getUtilization(req, res, next) {
  try {
    const data = await dashboardService.getUtilization();
    res.json({ success: true, message: "Utilization data retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getDepartmentAssets(req, res, next) {
  try {
    const data = await dashboardService.getDepartmentAssets();
    res.json({ success: true, message: "Department asset data retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getMaintenanceCost(req, res, next) {
  try {
    const data = await dashboardService.getMaintenanceCost();
    res.json({ success: true, message: "Maintenance cost data retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getBookingStats(req, res, next) {
  try {
    const data = await dashboardService.getBookingStats();
    res.json({ success: true, message: "Booking statistics retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}

export async function getAuditCompletion(req, res, next) {
  try {
    const data = await dashboardService.getAuditCompletion();
    res.json({ success: true, message: "Audit completion data retrieved successfully", data });
  } catch (err) {
    next(err);
  }
}
