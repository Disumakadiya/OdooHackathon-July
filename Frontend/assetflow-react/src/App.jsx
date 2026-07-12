import { BrowserRouter, Routes, Route } from 'react-router-dom';
import assetflow_admin_dashboard from './pages/assetflow_admin_dashboard';
import assetflow_enterprise_authentication from './pages/assetflow_enterprise_authentication';
import assetflow_asset_categories from './pages/assetflow_asset_categories';
import assetflow_asset_verification from './pages/assetflow_asset_verification';
import assetflow_audit_dashboard from './pages/assetflow_audit_dashboard';
import assetflow_booking_calendar from './pages/assetflow_booking_calendar';
import assetflow_create_booking from './pages/assetflow_create_booking';
import assetflow_department_management from './pages/assetflow_department_management';
import assetflow_discrepancy_report from './pages/assetflow_discrepancy_report';
import assetflow_employee_directory from './pages/assetflow_employee_directory';
import assetflow_maintenance_approval from './pages/assetflow_maintenance_approval';
import assetflow_maintenance_requests from './pages/assetflow_maintenance_requests';
import assetflow_organization_settings from './pages/assetflow_organization_settings';
import assetflow_user_role_management from './pages/assetflow_user_role_management';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<assetflow_admin_dashboard />} />
        <Route path="/login" element={<assetflow_enterprise_authentication />} />
        <Route path="/assetflow_asset_categories" element={<assetflow_asset_categories />} />
        <Route path="/assetflow_asset_verification" element={<assetflow_asset_verification />} />
        <Route path="/assetflow_audit_dashboard" element={<assetflow_audit_dashboard />} />
        <Route path="/assetflow_booking_calendar" element={<assetflow_booking_calendar />} />
        <Route path="/assetflow_create_booking" element={<assetflow_create_booking />} />
        <Route path="/assetflow_department_management" element={<assetflow_department_management />} />
        <Route path="/assetflow_discrepancy_report" element={<assetflow_discrepancy_report />} />
        <Route path="/assetflow_employee_directory" element={<assetflow_employee_directory />} />
        <Route path="/assetflow_maintenance_approval" element={<assetflow_maintenance_approval />} />
        <Route path="/assetflow_maintenance_requests" element={<assetflow_maintenance_requests />} />
        <Route path="/assetflow_organization_settings" element={<assetflow_organization_settings />} />
        <Route path="/assetflow_user_role_management" element={<assetflow_user_role_management />} />
      </Routes>
    </BrowserRouter>
  );
}
