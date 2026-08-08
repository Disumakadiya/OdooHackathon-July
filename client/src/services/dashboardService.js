import api from "./baseService";

const USE_MOCK = false;

function extractData(response) {
  return response?.data?.data || response?.data || response;
}

export async function fetchDashboardKpis(assets = []) {
  const { data } = await api.get("/dashboard/kpis");
  return extractData(data);
}

export async function fetchRecentActivities() {
  const { data } = await api.get("/dashboard/activities");
  return extractData(data);
}

export async function fetchQuickActions() {
  return [
    { id: "qa-1", label: "Register Asset", icon: "inventory", route: "/assetflow_asset_verification" },
    { id: "qa-2", label: "Book Resource", icon: "event_available", route: "/assetflow_booking_calendar" },
    { id: "qa-3", label: "Raise Maintenance", icon: "build", route: "/assetflow_maintenance_requests" },
    { id: "qa-4", label: "Create Audit", icon: "add_task", route: "/audit" },
    { id: "qa-5", label: "Verify Assets", icon: "qr_code_scanner", route: "/assets" },
    { id: "qa-6", label: "View Reports", icon: "assessment", route: "/reports" },
  ];
}

export async function fetchAssetUtilization() {
  const { data } = await api.get("/dashboard/utilization");
  return extractData(data);
}

export async function fetchDepartmentWiseAssets() {
  const { data } = await api.get("/dashboard/departments");
  return extractData(data);
}

export async function fetchMaintenanceCost() {
  const { data } = await api.get("/dashboard/maintenance-cost");
  return extractData(data);
}

export async function fetchBookingStatistics() {
  const { data } = await api.get("/dashboard/bookings");
  return extractData(data);
}

export async function fetchAuditCompletion() {
  const { data } = await api.get("/dashboard/audit-completion");
  return extractData(data);
}

export async function fetchNotifications() {
  const { data } = await api.get("/notifications");
  return extractData(data);
}
