export const dashboardKpis = [
  { id: "total-assets", label: "Total Assets", value: 2842, trend: "+12%", trendType: "positive", icon: "inventory_2" },
  { id: "available-assets", label: "Available Assets", value: 1638, trend: "+4%", trendType: "positive", icon: "check_circle" },
  { id: "allocated-assets", label: "Allocated Assets", value: 972, trend: "-2%", trendType: "neutral", icon: "assignment_ind" },
  { id: "under-maintenance", label: "Assets Under Maintenance", value: 48, trend: "+8%", trendType: "warning", icon: "build" },
  { id: "pending-audits", label: "Pending Audits", value: 19, trend: "5 due today", trendType: "warning", icon: "fact_check" },
  { id: "active-bookings", label: "Active Bookings", value: 74, trend: "+9%", trendType: "positive", icon: "event_available" },
];

export const recentActivities = [
  {
    id: "act-1",
    title: "Asset Assigned",
    description: "MacBook Pro #AS-1021 assigned to Alex Morgan",
    time: "10 mins ago",
  },
  {
    id: "act-2",
    title: "Transfer Approved",
    description: "Warehouse scanner #AS-551 moved to IT Support",
    time: "42 mins ago",
  },
  {
    id: "act-3",
    title: "Maintenance Approved",
    description: "Generator Unit #AS-778 moved to maintenance queue",
    time: "1 hour ago",
  },
  {
    id: "act-4",
    title: "Audit Reminder",
    description: "Finance department audit starts tomorrow",
    time: "3 hours ago",
  },
];

export const quickActions = [
  { id: "qa-1", label: "Create Audit", icon: "add_task", route: "/audit" },
  { id: "qa-2", label: "Verify Assets", icon: "qr_code_scanner", route: "/assets" },
  { id: "qa-3", label: "View Reports", icon: "assessment", route: "/reports" },
  { id: "qa-4", label: "Register Asset", icon: "inventory", route: "/assetflow_asset_registration" },
];

export const assetUtilization = [
  { id: "util-1", label: "In Use", value: 62 },
  { id: "util-2", label: "Available", value: 28 },
  { id: "util-3", label: "Maintenance", value: 10 },
];

export const departmentWiseAssets = [
  { id: "dep-1", department: "IT", count: 860 },
  { id: "dep-2", department: "Operations", count: 720 },
  { id: "dep-3", department: "Finance", count: 490 },
  { id: "dep-4", department: "HR", count: 360 },
  { id: "dep-5", department: "Admin", count: 412 },
];

export const maintenanceCost = [
  { id: "mc-1", month: "Jan", cost: 8600 },
  { id: "mc-2", month: "Feb", cost: 7900 },
  { id: "mc-3", month: "Mar", cost: 9200 },
  { id: "mc-4", month: "Apr", cost: 8800 },
  { id: "mc-5", month: "May", cost: 9800 },
  { id: "mc-6", month: "Jun", cost: 10400 },
];

export const bookingStatistics = [
  { id: "bk-1", label: "Today", value: 18 },
  { id: "bk-2", label: "This Week", value: 74 },
  { id: "bk-3", label: "This Month", value: 301 },
];

export const auditCompletion = [
  { id: "ac-1", label: "Completed", value: 81 },
  { id: "ac-2", label: "In Progress", value: 14 },
  { id: "ac-3", label: "Pending", value: 5 },
];
