import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const roleCards = [
  {
    iconBg: 'bg-primary/10', iconColor: 'text-primary', icon: 'security', iconFill: true,
    users: '2 Users', name: 'Admin', desc: 'Full system access, including financial settings and user management.',
    perms: [
      { label: 'User Management', checked: true },
      { label: 'Financial Records', checked: true },
      { label: 'System Config', checked: true },
    ]
  },
  {
    iconBg: 'bg-secondary/10', iconColor: 'text-secondary', icon: 'manage_accounts', iconFill: true,
    users: '14 Users', name: 'Manager', desc: 'Access to department reports, asset assignment, and audits.',
    perms: [
      { label: 'Department Reports', checked: true },
      { label: 'Assign Assets', checked: true },
      { label: 'Financial Records', checked: false },
    ]
  },
  {
    iconBg: 'bg-on-tertiary-container/30', iconColor: 'text-tertiary', icon: 'badge', iconFill: true,
    users: '124 Users', name: 'Staff', desc: 'View assigned assets and submit maintenance request tickets.',
    perms: [
      { label: 'View My Assets', checked: true },
      { label: 'Maintenance Request', checked: true },
      { label: 'Inventory Edit', checked: false },
    ]
  },
];

const matrixRows = [
  { icon: 'inventory', label: 'Asset Inventory', sub: 'Physical hardware tracking', perms: [true, true, true, false, true] },
  { icon: 'account_balance', label: 'Financial Ledger', sub: 'Asset valuation and depreciation', perms: [false, true, false, false, false] },
  { icon: 'history_edu', label: 'Maintenance Logs', sub: 'Service history and repair tickets', perms: [true, true, true, true, true] },
  { icon: 'groups_2', label: 'Employee Profiles', sub: 'User data and department links', perms: [false, true, false, false, false] },
];

export default function assetflow_user_role_management() {
  useEffect(() => { document.title = 'User Role Management - AssetFlow'; }, []);

  return (
    <div className="min-h-screen bg-surface-container-low">
      <Sidebar />

      <main className="md:ml-64 min-h-screen">
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant px-lg py-sm flex justify-between items-center w-full max-w-max-width mx-auto h-16">
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-on-surface-variant">search</span>
              <input className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-primary transition-all w-64" placeholder="Search roles or permissions..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
              <span className="material-symbols-outlined">help</span>
            </button>
            <div className="h-8 w-px bg-outline-variant mx-2"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="font-label-md text-label-md text-on-surface leading-none">Elena Thorne</p>
                <p className="font-label-sm text-label-sm text-on-surface-variant leading-none mt-1">Super Admin</p>
              </div>
              <img className="w-10 h-10 rounded-full border-2 border-surface-container-highest object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMb4jtnW6uDRrrR-w9bYm_FwOkD8uNaoNfi6nnj253O1vCbqY42jubwDGrZxP3DazhjOFlmZiCE44yd3G7kK2c_TAip2zrL_cnMQZsv9U7l9s_n2RQPkfEB-n-SkCe4zaj1MZ_JzYLNE2JVaE-2BgjsH5tohjNfZTu4dc0vE6SwzuPG33wiMpwLk00_ZWlbv8KYJZMqX1ZBcpagnuNvHzbZ0xtsrSjkoHraMwFWwpCZyjdizlA3ugiww" alt="Elena" />
            </div>
          </div>
        </header>

        <div className="max-w-max-width mx-auto px-lg py-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-4">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary">User Role Management</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Define and manage granular permissions for your organization's hierarchy.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-md py-2 text-primary border border-outline-variant rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined text-[20px]">file_download</span> Export CSV
              </button>
              <button className="flex items-center gap-2 px-md py-2 bg-primary text-white rounded-lg font-label-md text-label-md hover:opacity-90 transition-all">
                <span className="material-symbols-outlined text-[20px]">add</span> Create New Role
              </button>
            </div>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {roleCards.map((role, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl p-lg custom-shadow border border-outline-variant/30 flex flex-col">
                <div className="flex justify-between items-start mb-md">
                  <div className={`w-12 h-12 rounded-xl ${role.iconBg} flex items-center justify-center ${role.iconColor}`}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{role.icon}</span>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 bg-secondary-container text-on-secondary-container rounded font-label-sm text-label-sm">
                    <span className="material-symbols-outlined text-[14px]">person</span> {role.users}
                  </div>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface">{role.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-sm mb-lg">{role.desc}</p>
                <div className="space-y-4 pt-4 border-t border-outline-variant/50">
                  {role.perms.map((perm, j) => (
                    <div key={j} className="flex items-center justify-between">
                      <span className="font-label-md text-label-md text-on-surface">{perm.label}</span>
                      <input defaultChecked={perm.checked} className="w-5 h-5 rounded-[4px] border-outline-variant text-secondary cursor-pointer accent-secondary" type="checkbox" />
                    </div>
                  ))}
                </div>
                <button className="mt-xl w-full py-2 text-primary font-label-md text-label-md hover:bg-surface-container transition-all rounded-lg">Edit Details</button>
              </div>
            ))}
          </div>

          {/* Permission Matrix */}
          <div className="mt-xl bg-surface-container-lowest rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md text-on-surface">Granular Permission Matrix</h3>
                <p className="font-label-md text-label-md text-on-surface-variant">Global override settings for specific module interactions.</p>
              </div>
              <button className="px-3 py-1 bg-surface-container text-on-surface-variant rounded-full text-label-sm font-label-sm">View History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low">
                  <tr>
                    <th className="px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Module / Action</th>
                    {['Create', 'Read', 'Update', 'Delete', 'Audit'].map(h => (
                      <th key={h} className="px-lg py-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {matrixRows.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container/30 transition-colors">
                      <td className="px-lg py-4">
                        <div className="flex items-center gap-3">
                          <span className="material-symbols-outlined text-primary">{row.icon}</span>
                          <div>
                            <p className="font-label-md text-label-md text-on-surface">{row.label}</p>
                            <p className="font-label-sm text-label-sm text-on-surface-variant">{row.sub}</p>
                          </div>
                        </div>
                      </td>
                      {row.perms.map((checked, j) => (
                        <td key={j} className="px-lg py-4 text-center">
                          <input defaultChecked={checked} className="w-5 h-5 rounded-[4px] border-outline-variant cursor-pointer accent-secondary" type="checkbox" />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-lg bg-surface-container-low flex justify-between items-center">
              <p className="font-label-sm text-label-sm text-on-surface-variant">All changes are logged for auditing purposes.</p>
              <div className="flex gap-3">
                <button className="px-md py-2 font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors">Discard Changes</button>
                <button className="px-lg py-2 bg-secondary text-white rounded-lg font-label-md text-label-md shadow-lg shadow-secondary/10 hover:opacity-90 transition-all">Save Changes</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="max-w-max-width mx-auto px-lg py-xl mt-xl border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-on-surface-variant">verified_user</span>
            <p className="font-label-sm text-label-sm text-on-surface-variant">ISO 27001 Certified Identity Management</p>
          </div>
          <div className="flex gap-6">
            {['Privacy Policy', 'Security Audit Log', 'Help Center'].map(link => (
              <a key={link} className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors" href="#">{link}</a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
