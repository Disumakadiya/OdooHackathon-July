import { BrowserRouter, Routes, Route } from "react-router-dom";

import AssetflowAdminDashboard from "./pages/assetflow_admin_dashboard";
import AssetflowEnterpriseAuthentication from "./pages/assetflow_enterprise_authentication";
import AssetflowAssetCategories from "./pages/assetflow_asset_categories";
import AssetflowAssetVerification from "./pages/assetflow_asset_verification";
import AssetflowAuditDashboard from "./pages/assetflow_audit_dashboard";
import AssetflowBookingCalendar from "./pages/assetflow_booking_calendar";
import AssetflowCreateBooking from "./pages/assetflow_create_booking";
import AssetflowDepartmentManagement from "./pages/assetflow_department_management";
import AssetflowDiscrepancyReport from "./pages/assetflow_discrepancy_report";
import AssetflowEmployeeDirectory from "./pages/assetflow_employee_directory";
import AssetflowMaintenanceApproval from "./pages/assetflow_maintenance_approval";
import AssetflowMaintenanceRequests from "./pages/assetflow_maintenance_requests";
import AssetflowOrganizationSettings from "./pages/assetflow_organization_settings";
import AssetflowUserRoleManagement from "./pages/assetflow_user_role_management";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssetflowAdminDashboard />} />
        <Route
          path="/login"
          element={<AssetflowEnterpriseAuthentication />}
        />
        <Route
          path="/assetflow_asset_categories"
          element={<AssetflowAssetCategories />}
        />
        <Route
          path="/assetflow_asset_verification"
          element={<AssetflowAssetVerification />}
        />
        <Route
          path="/assetflow_audit_dashboard"
          element={<AssetflowAuditDashboard />}
        />
        <Route
          path="/assetflow_booking_calendar"
          element={<AssetflowBookingCalendar />}
        />
        <Route
          path="/assetflow_create_booking"
          element={<AssetflowCreateBooking />}
        />
        <Route
          path="/assetflow_department_management"
          element={<AssetflowDepartmentManagement />}
        />
        <Route
          path="/assetflow_discrepancy_report"
          element={<AssetflowDiscrepancyReport />}
        />
        <Route
          path="/assetflow_employee_directory"
          element={<AssetflowEmployeeDirectory />}
        />
        <Route
          path="/assetflow_maintenance_approval"
          element={<AssetflowMaintenanceApproval />}
        />
        <Route
          path="/assetflow_maintenance_requests"
          element={<AssetflowMaintenanceRequests />}
        />
        <Route
          path="/assetflow_organization_settings"
          element={<AssetflowOrganizationSettings />}
        />
        <Route
          path="/assetflow_user_role_management"
          element={<AssetflowUserRoleManagement />}
        />
      </Routes>
    </BrowserRouter>
  );
}