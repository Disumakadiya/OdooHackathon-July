import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import AssetflowEnterpriseAuthentication from "../pages/Authentication/assetflow_enterprise_authentication";
import AssetflowAdminDashboard from "../pages/Dashboard/assetflow_admin_dashboard";
import AssetflowDepartmentManagement from "../pages/OrganizationSetup/assetflow_department_management";
import AssetflowEmployeeDirectory from "../pages/OrganizationSetup/assetflow_employee_directory";
import AssetflowAssetCategories from "../pages/OrganizationSetup/assetflow_asset_categories";
import AssetflowUserRoleManagement from "../pages/OrganizationSetup/assetflow_user_role_management";
import AssetflowOrganizationSettings from "../pages/OrganizationSetup/assetflow_organization_settings";
import AssetflowAssetVerification from "../pages/Assets/assetflow_asset_verification";
import AssetflowAssetDirectory from "../pages/Assets/assetflow_asset_directory";
import AssetflowAssetRegistration from "../pages/Assets/assetflow_asset_registration";
import AssetflowAssetAllocation from "../pages/AllocationTransfer/assetflow_asset_allocation";
import AssetflowAssetTransfer from "../pages/AllocationTransfer/assetflow_asset_transfer";
import AssetflowAssetReturn from "../pages/AllocationTransfer/assetflow_asset_return";
import AssetflowBookingCalendar from "../pages/ResourceBooking/assetflow_booking_calendar";
import AssetflowCreateBooking from "../pages/ResourceBooking/assetflow_create_booking";
import AssetflowMaintenanceRequests from "../pages/Maintenance/assetflow_maintenance_requests";
import AssetflowMaintenanceApproval from "../pages/Maintenance/assetflow_maintenance_approval";
import AssetflowAuditDashboard from "../pages/Audit/assetflow_audit_dashboard";
import AssetflowDiscrepancyReport from "../pages/Audit/assetflow_discrepancy_report";
import AssetflowReports from "../pages/Reports/assetflow_reports";
import AssetflowAnalytics from "../pages/Reports/assetflow_analytics";
import AssetflowNotifications from "../pages/Notifications/assetflow_notifications";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AssetflowEnterpriseAuthentication />} />
      
      {/* Base protected routes (accessible to authenticated users) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AssetflowAdminDashboard />} />
        <Route path="/dashboard" element={<AssetflowAdminDashboard />} />
        <Route path="/audit" element={<AssetflowAuditDashboard />} />
        <Route path="/assets" element={<AssetflowAssetVerification />} />
        <Route path="/reports" element={<AssetflowAdminDashboard />} />
        
        {/* Admin Only Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/assetflow_department_management" element={<AssetflowDepartmentManagement />} />
          <Route path="/assetflow_user_role_management" element={<AssetflowUserRoleManagement />} />
          <Route path="/assetflow_organization_settings" element={<AssetflowOrganizationSettings />} />
        </Route>

        {/* Admin & Asset Manager Routes */}
        <Route element={<ProtectedRoute allowedRoles={['Admin', 'Asset Manager']} />}>
          <Route path="/assetflow_asset_categories" element={<AssetflowAssetCategories />} />
          <Route path="/assetflow_employee_directory" element={<AssetflowEmployeeDirectory />} />
        </Route>

        {/* Shared / Other Routes */}
        <Route path="/assetflow_asset_verification" element={<AssetflowAssetVerification />} />
        <Route path="/assetflow_asset_directory" element={<AssetflowAssetDirectory />} />
        <Route path="/assetflow_asset_registration" element={<AssetflowAssetRegistration />} />
        <Route path="/assetflow_asset_allocation" element={<AssetflowAssetAllocation />} />
        <Route path="/assetflow_asset_transfer" element={<AssetflowAssetTransfer />} />
        <Route path="/assetflow_asset_return" element={<AssetflowAssetReturn />} />
        <Route path="/assetflow_booking_calendar" element={<AssetflowBookingCalendar />} />
        <Route path="/assetflow_create_booking" element={<AssetflowCreateBooking />} />
        <Route path="/assetflow_maintenance_requests" element={<AssetflowMaintenanceRequests />} />
        <Route path="/assetflow_maintenance_approval" element={<AssetflowMaintenanceApproval />} />
        <Route path="/assetflow_audit_dashboard" element={<AssetflowAuditDashboard />} />
        <Route path="/assetflow_discrepancy_report" element={<AssetflowDiscrepancyReport />} />
        <Route path="/assetflow_reports" element={<AssetflowReports />} />
        <Route path="/assetflow_analytics" element={<AssetflowAnalytics />} />
        <Route path="/assetflow_notifications" element={<AssetflowNotifications />} />
      </Route>
    </Routes>
  );
}
