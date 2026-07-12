import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Audit', icon: 'fact_check', path: '/audit' },
  { label: 'Asset Verification', icon: 'qr_code_scanner', path: '/assets' },
  { label: 'Reports', icon: 'assessment', path: '/reports' },
  { label: 'Departments', icon: 'domain', path: '/assetflow_department_management', roles: ['Admin'] },
  { label: 'Asset Categories', icon: 'category', path: '/assetflow_asset_categories', roles: ['Admin', 'Asset Manager'] },
  { label: 'Employee Directory', icon: 'group', path: '/assetflow_employee_directory', roles: ['Admin', 'Asset Manager'] },
  { label: 'User Roles', icon: 'admin_panel_settings', path: '/assetflow_user_role_management', roles: ['Admin'] },
  { label: 'Booking', icon: 'event', path: '/assetflow_booking_calendar' },
  { label: 'Create Booking', icon: 'add_circle', path: '/assetflow_create_booking' },
  { label: 'Maintenance', icon: 'build', path: '/assetflow_maintenance_requests' },
  { label: 'Maintenance Approval', icon: 'task_alt', path: '/assetflow_maintenance_approval' },
  { label: 'Audit Legacy', icon: 'fact_check', path: '/assetflow_audit_dashboard' },
  { label: 'Asset Verification Legacy', icon: 'qr_code_scanner', path: '/assetflow_asset_verification' },
  { label: 'Discrepancy Report', icon: 'running_with_errors', path: '/assetflow_discrepancy_report' },
  { label: 'Organization Settings', icon: 'settings', path: '/assetflow_organization_settings', roles: ['Admin'] },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = navItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-surface-container-low border-r border-outline-variant z-50 flex-col p-md space-y-base hidden md:flex">
      <div className="px-md py-lg flex items-center gap-sm">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>inventory_2</span>
        </div>
        <div>
          <h1 className="font-headline-md text-headline-md font-bold text-primary">AssetFlow</h1>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-70 uppercase tracking-wider">Enterprise Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar pt-md">
        <div className="space-y-1">
          {filteredNavItems.map((item) => {
            const isActive =
              location.pathname === item.path || (item.path === '/dashboard' && location.pathname === '/');
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-md py-sm rounded-lg sidebar-transition group ${
                  isActive
                    ? 'text-primary font-bold bg-surface-container-highest'
                    : 'text-on-surface-variant hover:bg-surface-container transition-all'
                }`}
              >
                <span
                  className="material-symbols-outlined mr-md group-hover:scale-110 sidebar-transition"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                >
                  {item.icon}
                </span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="pt-lg border-t border-outline-variant mt-auto">
        <div className="flex items-center p-sm rounded-lg bg-surface-container-highest/50 justify-between">
          <div className="flex items-center overflow-hidden">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBBGvzfA-eFWqye4M7Mww3XP4F98fdh7JXa5tXlV_V9L-jZlEoFGSLyTL-02Ndg9Av-y83q4HUFmahXFa2YyrkJM-BtV94cYg7GbnB5oGFH0HPXwYWbNM6M7-1kPdB8R_oGOWvRYG5L-Sfw6H7rikD31TcmDcRea6AiRziwod0CTevosjazV2EqcN-ntralvNJiiKXFC6jgMf-WnTs5CNYrguv5AfYqRwvRKGP4_86-oAUqOMc5DlczQ"
              alt="User Profile"
            />
            <div className="ml-sm overflow-hidden">
              <p className="font-label-md text-label-md text-primary font-bold truncate">{user?.name || 'Administrator'}</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">{user?.email || 'System User'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="material-symbols-outlined text-outline-variant hover:text-error transition-colors p-1" title="Logout">
            logout
          </button>
        </div>
      </div>
    </aside>
  );
}
