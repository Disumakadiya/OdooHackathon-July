import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: 'dashboard', path: '/' },
  { label: 'Departments', icon: 'domain', path: '/assetflow_department_management' },
  { label: 'Asset Categories', icon: 'category', path: '/assetflow_asset_categories' },
  { label: 'Employee Directory', icon: 'group', path: '/assetflow_employee_directory' },
  { label: 'User Roles', icon: 'admin_panel_settings', path: '/assetflow_user_role_management' },
  { label: 'Booking Calendar', icon: 'event', path: '/assetflow_booking_calendar' },
  { label: 'Create Booking', icon: 'add_circle', path: '/assetflow_create_booking' },
  { label: 'Maintenance Requests', icon: 'build', path: '/assetflow_maintenance_requests' },
  { label: 'Maintenance Approval', icon: 'task_alt', path: '/assetflow_maintenance_approval' },
  { label: 'Audit Dashboard', icon: 'fact_check', path: '/assetflow_audit_dashboard' },
  { label: 'Asset Verification', icon: 'qr_code_scanner', path: '/assetflow_asset_verification' },
  { label: 'Discrepancy Report', icon: 'running_with_errors', path: '/assetflow_discrepancy_report' },
  { label: 'Organization Settings', icon: 'settings', path: '/assetflow_organization_settings' },
];

export default function DashboardLayout() {
  return (
    <div className="font-body-md text-body-md">
      <aside className="fixed left-0 top-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-low p-md md:flex">
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
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center px-md py-sm rounded-lg sidebar-transition group ${
                    isActive
                      ? 'text-primary font-bold bg-surface-container-highest'
                      : 'text-on-surface-variant hover:bg-surface-container transition-all'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span
                      className="material-symbols-outlined mr-md group-hover:scale-110 sidebar-transition"
                      style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}
                    >
                      {item.icon}
                    </span>
                    <span className="font-label-md text-label-md">{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="pt-lg border-t border-outline-variant mt-auto">
          <div className="flex items-center p-sm rounded-lg bg-surface-container-highest/50">
            <img
              className="w-10 h-10 rounded-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBBGvzfA-eFWqye4M7Mww3XP4F98fdh7JXa5tXlV_V9L-jZlEoFGSLyTL-02Ndg9Av-y83q4HUFmahXFa2YyrkJM-BtV94cYg7GbnB5oGFH0HPXwYWbNM6M7-1kPdB8R_oGOWvRYG5L-Sfw6H7rikD31TcmDcRea6AiRziwod0CTevosjazV2EqcN-ntralvNJiiKXFC6jgMf-WnTs5CNYrguv5AfYqRwvRKGP4_86-oAUqOMc5DlczQ"
              alt="User Profile"
            />
            <div className="ml-sm overflow-hidden">
              <p className="font-label-md text-label-md text-primary font-bold truncate">Julian Thorne</p>
              <p className="font-label-sm text-label-sm text-on-surface-variant truncate">Operations Director</p>
            </div>
          </div>
        </div>
      </aside>

      <header className="sticky top-0 z-40 border-b border-outline-variant bg-surface px-lg py-sm md:ml-64 flex items-center justify-between">
        <div className="font-headline-md text-headline-md text-primary font-bold">AssetFlow</div>
        <div className="flex items-center gap-md">
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">help</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer border border-outline-variant">
            <img
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_wYUP-B99hzWJgrrVj1wr1DWo1ng1FimoXw8mNRuymH5KALJ-fymFR7KwKqk2bvQOtl19Np-615SLkskP7UzkPHUxYPoyoZ6pv_4F8n_6okfFH9AMDnKIODePFFDE4fWgXblKp_xR1acxJUk0YZjF1cwJBHdtF967_ku3dWjjYnDpoXIcyF0EkJnyXwoe3DNnOwP7PXLF_HdbA99CsBvwocYW00Vpbf1JhWh53tdv2Yna9ez92Zpmg"
              alt="User"
            />
          </div>
        </div>
      </header>

      <main className="md:ml-64 min-h-[calc(100vh-57px)] bg-surface-container-low">
        <Outlet />
      </main>
    </div>
  );
}
