export const auditSummaryCards = [
  { id: "sum-1", title: "Total Audits", value: 56, helper: "FY 2026", icon: "fact_check" },
  { id: "sum-2", title: "Active Audits", value: 12, helper: "3 ending this week", icon: "pending_actions" },
  { id: "sum-3", title: "Completed Audits", value: 39, helper: "69.6% completion", icon: "task_alt" },
  { id: "sum-4", title: "Pending Audits", value: 5, helper: "Needs assignment", icon: "schedule" },
];

export const activeAudits = [
  { id: "AD-1021", department: "IT", auditor: "Maya Chen", status: "In Progress", date: "2026-07-14" },
  { id: "AD-1024", department: "Finance", auditor: "Liam Ward", status: "Scheduled", date: "2026-07-16" },
  { id: "AD-1028", department: "Operations", auditor: "Nora Patel", status: "In Progress", date: "2026-07-18" },
  { id: "AD-1030", department: "HR", auditor: "Ava Kim", status: "Scheduled", date: "2026-07-19" },
];

export const completedAudits = [
  { id: "AD-1007", department: "Admin", auditor: "Ethan Cole", status: "Completed", date: "2026-07-06" },
  { id: "AD-1009", department: "Logistics", auditor: "Iris Shah", status: "Completed", date: "2026-07-07" },
  { id: "AD-1015", department: "IT", auditor: "Maya Chen", status: "Completed", date: "2026-07-09" },
];

export const discrepancyReportRows = [
  { id: "DR-1", asset: "MacBook Pro 14", department: "IT", issue: "Missing", assignedTo: "Maya Chen", status: "Open" },
  { id: "DR-2", asset: "Forklift Unit F-18", department: "Operations", issue: "Damaged", assignedTo: "Nora Patel", status: "In Review" },
  { id: "DR-3", asset: "Projector P-302", department: "Admin", issue: "Lost", assignedTo: "Iris Shah", status: "Open" },
  { id: "DR-4", asset: "Camera Kit C-4", department: "Marketing", issue: "Damaged", assignedTo: "Ava Kim", status: "Resolved" },
  { id: "DR-5", asset: "RFID Scanner R-12", department: "Logistics", issue: "Missing", assignedTo: "Liam Ward", status: "In Review" },
];

export const auditDepartments = ["All", "IT", "Finance", "Operations", "HR", "Admin", "Logistics", "Marketing"];
export const auditStatuses = ["All", "Scheduled", "In Progress", "Completed"];
