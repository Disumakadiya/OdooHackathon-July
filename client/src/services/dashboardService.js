import api from "./baseService";
import { dashboardKpis, recentActivities, quickActions, assetUtilization, departmentWiseAssets, maintenanceCost, bookingStatistics, auditCompletion } from "../assets/dashboardData";
import { notificationData } from "../assets/notificationData";

const USE_MOCK = false;


function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchDashboardKpis(assets = []) {
  if (USE_MOCK) {
    await delay();
    if (assets.length > 0) {
      const total = assets.length;
      const available = assets.filter((a) => a.status === "Available").length;
      const allocated = assets.filter((a) => a.status === "Allocated").length;
      const maintenance = assets.filter((a) => a.status === "Under Maintenance").length;
      return [
        { id: "total-assets", label: "Total Assets", value: total, trend: "+12%", trendType: "positive", icon: "inventory_2" },
        { id: "available-assets", label: "Available Assets", value: available, trend: "+4%", trendType: "positive", icon: "check_circle" },
        { id: "allocated-assets", label: "Allocated Assets", value: allocated, trend: "-2%", trendType: "neutral", icon: "assignment_ind" },
        { id: "active-bookings", label: "Active Bookings", value: 74, trend: "+9%", trendType: "positive", icon: "event_available" },
        { id: "pending-transfers", label: "Pending Transfers", value: 12, trend: "+3%", trendType: "warning", icon: "sync_alt" },
        { id: "pending-audits", label: "Pending Audits", value: 19, trend: "5 due today", trendType: "warning", icon: "fact_check" },
      ];
    }
    return dashboardKpis;
  }
  const { data } = await api.get("/dashboard/kpis");
  return data;
}

export async function fetchRecentActivities() {
  if (USE_MOCK) {
    await delay();
    return recentActivities;
  }
  const { data } = await api.get("/dashboard/activities");
  return data;
}

export async function fetchQuickActions() {
  if (USE_MOCK) {
    await delay();
    return quickActions;
  }
  const { data } = await api.get("/dashboard/quick-actions");
  return data;
}

export async function fetchAssetUtilization() {
  if (USE_MOCK) {
    await delay();
    return assetUtilization;
  }
  const { data } = await api.get("/dashboard/utilization");
  return data;
}

export async function fetchDepartmentWiseAssets() {
  if (USE_MOCK) {
    await delay();
    return departmentWiseAssets;
  }
  const { data } = await api.get("/dashboard/departments");
  return data;
}

export async function fetchMaintenanceCost() {
  if (USE_MOCK) {
    await delay();
    return maintenanceCost;
  }
  const { data } = await api.get("/dashboard/maintenance-cost");
  return data;
}

export async function fetchBookingStatistics() {
  if (USE_MOCK) {
    await delay();
    return bookingStatistics;
  }
  const { data } = await api.get("/dashboard/bookings");
  return data;
}

export async function fetchAuditCompletion() {
  if (USE_MOCK) {
    await delay();
    return auditCompletion;
  }
  const { data } = await api.get("/dashboard/audit-completion");
  return data;
}

export async function fetchNotifications() {
  if (USE_MOCK) {
    await delay();
    return notificationData;
  }
  const { data } = await api.get("/notifications");
  return data;
}
