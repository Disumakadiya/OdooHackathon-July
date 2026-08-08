import pool from "../config/db.js";

export const getKpis = async (req, res) => {
  try {
    const totalAssets = await pool.query('SELECT COUNT(*) FROM assets');
    const available = await pool.query('SELECT COUNT(*) FROM assets WHERE status = $1', ['Available']);
    const allocated = await pool.query('SELECT COUNT(*) FROM assets WHERE status = $1', ['Allocated']);
    const maintenance = await pool.query('SELECT COUNT(*) FROM assets WHERE status = $1', ['Under Maintenance']);
    
    res.json([
      { id: "total-assets", label: "Total Assets", value: parseInt(totalAssets.rows[0].count), trend: "+0%", trendType: "neutral", icon: "inventory_2" },
      { id: "available-assets", label: "Available Assets", value: parseInt(available.rows[0].count), trend: "+0%", trendType: "neutral", icon: "check_circle" },
      { id: "allocated-assets", label: "Allocated Assets", value: parseInt(allocated.rows[0].count), trend: "+0%", trendType: "neutral", icon: "assignment_ind" },
      { id: "maintenance-assets", label: "Under Maintenance", value: parseInt(maintenance.rows[0].count), trend: "attention", trendType: "warning", icon: "build" },
    ]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentActivities = async (req, res) => {
  try {
    const activities = await pool.query('SELECT * FROM activity_logs ORDER BY timestamp DESC LIMIT 5');
    res.json(activities.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getQuickActions = async (req, res) => {
  res.json([
    { id: "add-asset", label: "Add Asset", icon: "add_circle" },
    { id: "allocate", label: "Allocate", icon: "assignment_ind" },
    { id: "maintenance", label: "Maintenance", icon: "build" },
  ]);
};

export const getAssetUtilization = async (req, res) => {
  res.json([{ name: "Used", value: 70 }, { name: "Idle", value: 30 }]);
};

export const getDepartmentWiseAssets = async (req, res) => {
  res.json([{ name: "IT", value: 50 }, { name: "HR", value: 10 }]);
};

export const getMaintenanceCost = async (req, res) => {
  res.json([{ month: "Jan", cost: 100 }, { month: "Feb", cost: 120 }]);
};

export const getBookingStatistics = async (req, res) => {
  res.json([{ month: "Jan", count: 20 }, { month: "Feb", count: 30 }]);
};

export const getAuditCompletion = async (req, res) => {
  res.json([{ name: "Completed", value: 80 }, { name: "Pending", value: 20 }]);
};
