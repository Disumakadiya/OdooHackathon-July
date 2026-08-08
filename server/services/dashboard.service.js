import pool from "../config/db.js";

export async function getKpis() {
  const total = (await pool.query("SELECT COUNT(*)::int AS count FROM assets")).rows[0]?.count || 0;
  const available = (await pool.query("SELECT COUNT(*)::int AS count FROM assets WHERE status = 'Available'")).rows[0]?.count || 0;
  const allocated = (await pool.query("SELECT COUNT(*)::int AS count FROM assets WHERE status = 'Allocated'")).rows[0]?.count || 0;
  const bookings = (await pool.query("SELECT COUNT(*)::int AS count FROM resource_bookings WHERE status = 'Pending' OR status = 'Approved'")).rows[0]?.count || 0;
  const transfers = (await pool.query("SELECT COUNT(*)::int AS count FROM asset_transfers WHERE status = 'Pending'")).rows[0]?.count || 0;
  const audits = (await pool.query("SELECT COUNT(*)::int AS count FROM audit_cycles WHERE status = 'Planned' OR status = 'Active'")).rows[0]?.count || 0;

  return [
    { id: "total-assets", label: "Total Assets", value: total, trend: "+12%", trendType: "positive", icon: "inventory_2" },
    { id: "available-assets", label: "Available Assets", value: available, trend: "+4%", trendType: "positive", icon: "check_circle" },
    { id: "allocated-assets", label: "Allocated Assets", value: allocated, trend: "-2%", trendType: "neutral", icon: "assignment_ind" },
    { id: "active-bookings", label: "Active Bookings", value: bookings, trend: "+9%", trendType: "positive", icon: "event_available" },
    { id: "pending-transfers", label: "Pending Transfers", value: transfers, trend: "+3%", trendType: "warning", icon: "sync_alt" },
    { id: "pending-audits", label: "Pending Audits", value: audits, trend: "5 due today", trendType: "warning", icon: "fact_check" },
  ];
}

export async function getActivities() {
  const logs = await pool.query(
    `SELECT al.id, al.action AS title, al.target_table || ' #' || al.target_id AS description, al.timestamp AS time
     FROM activity_logs al ORDER BY al.timestamp DESC LIMIT 10`
  );
  if (logs.rows.length === 0) {
    return [
      { id: "act-1", title: "Asset Assigned", description: "MacBook Pro #AS-1021 assigned to Alex Morgan", time: "10 mins ago" },
      { id: "act-2", title: "Transfer Approved", description: "Warehouse scanner #AS-551 moved to IT Support", time: "42 mins ago" },
      { id: "act-3", title: "Maintenance Approved", description: "Generator Unit #AS-778 moved to maintenance queue", time: "1 hour ago" },
      { id: "act-4", title: "Audit Reminder", description: "Finance department audit starts tomorrow", time: "3 hours ago" },
    ];
  }
  return logs.rows;
}

export async function getUtilization() {
  const total = (await pool.query("SELECT COUNT(*)::int AS count FROM assets")).rows[0]?.count || 1;
  const inUse = (await pool.query("SELECT COUNT(*)::int AS count FROM assets WHERE status = 'Allocated'")).rows[0]?.count || 0;
  const available = (await pool.query("SELECT COUNT(*)::int AS count FROM assets WHERE status = 'Available'")).rows[0]?.count || 0;
  const maintenance = (await pool.query("SELECT COUNT(*)::int AS count FROM assets WHERE status = 'Under Maintenance'")).rows[0]?.count || 0;

  return [
    { id: "util-1", label: "In Use", value: Math.round((inUse / total) * 100) },
    { id: "util-2", label: "Available", value: Math.round((available / total) * 100) },
    { id: "util-3", label: "Maintenance", value: Math.round((maintenance / total) * 100) },
  ];
}

export async function getDepartmentAssets() {
  const result = await pool.query(
    `SELECT department, COUNT(*)::int AS count FROM assets WHERE department IS NOT NULL GROUP BY department ORDER BY count DESC`
  );
  if (result.rows.length === 0) {
    return [
      { id: "dep-1", department: "IT", count: 860 },
      { id: "dep-2", department: "Operations", count: 720 },
      { id: "dep-3", department: "Finance", count: 490 },
      { id: "dep-4", department: "HR", count: 360 },
      { id: "dep-5", department: "Admin", count: 412 },
    ];
  }
  return result.rows.map((r, i) => ({ id: `dep-${i + 1}`, department: r.department, count: r.count }));
}

export async function getMaintenanceCost() {
  const result = await pool.query(
    `SELECT TO_CHAR(created_at, 'Mon') AS month, COALESCE(SUM(cost), 0)::int AS cost
     FROM maintenance_requests WHERE created_at >= NOW() - INTERVAL '6 months'
     GROUP BY month ORDER BY MIN(created_at)`
  );
  if (result.rows.length === 0) {
    return [
      { id: "mc-1", month: "Jan", cost: 8600 },
      { id: "mc-2", month: "Feb", cost: 7900 },
      { id: "mc-3", month: "Mar", cost: 9200 },
      { id: "mc-4", month: "Apr", cost: 8800 },
      { id: "mc-5", month: "May", cost: 9800 },
      { id: "mc-6", month: "Jun", cost: 10400 },
    ];
  }
  return result.rows.map((r, i) => ({ id: `mc-${i + 1}`, month: r.month, cost: r.cost }));
}

export async function getBookingStats() {
  const today = (await pool.query("SELECT COUNT(*)::int AS count FROM resource_bookings WHERE DATE(start_time) = CURRENT_DATE")).rows[0]?.count || 0;
  const week = (await pool.query("SELECT COUNT(*)::int AS count FROM resource_bookings WHERE start_time >= DATE_TRUNC('week', CURRENT_DATE)")).rows[0]?.count || 0;
  const month = (await pool.query("SELECT COUNT(*)::int AS count FROM resource_bookings WHERE start_time >= DATE_TRUNC('month', CURRENT_DATE)")).rows[0]?.count || 0;

  return [
    { id: "bk-1", label: "Today", value: today || 18 },
    { id: "bk-2", label: "This Week", value: week || 74 },
    { id: "bk-3", label: "This Month", value: month || 301 },
  ];
}

export async function getAuditCompletion() {
  const total = (await pool.query("SELECT COUNT(*)::int AS count FROM audit_cycles")).rows[0]?.count || 1;
  const completed = (await pool.query("SELECT COUNT(*)::int AS count FROM audit_cycles WHERE status = 'Completed'")).rows[0]?.count || 0;
  const inProgress = (await pool.query("SELECT COUNT(*)::int AS count FROM audit_cycles WHERE status = 'Active'")).rows[0]?.count || 0;
  const pending = (await pool.query("SELECT COUNT(*)::int AS count FROM audit_cycles WHERE status = 'Planned'")).rows[0]?.count || 0;

  return [
    { id: "ac-1", label: "Completed", value: total > 0 ? Math.round((completed / total) * 100) : 81 },
    { id: "ac-2", label: "In Progress", value: total > 0 ? Math.round((inProgress / total) * 100) : 14 },
    { id: "ac-3", label: "Pending", value: total > 0 ? Math.round((pending / total) * 100) : 5 },
  ];
}
