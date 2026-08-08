import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function assetflow_department_management() {
  const [search, setSearch] = useState('');
  useEffect(() => { document.title = 'AssetFlow | Departments'; }, []);

  const departments = [
    { name: 'Engineering', code: 'ENG-01', head: 'Sarah Miller', initials: 'SM', headBg: 'bg-secondary-fixed text-on-secondary-fixed', location: 'Tech Plaza, Level 4', assets: '1,240', status: 'Active', statusColor: 'bg-secondary-container text-on-secondary-container' },
    { name: 'Marketing & Sales', code: 'MKT-04', head: 'James Duncan', initials: 'JD', headBg: 'bg-primary-fixed text-on-primary-fixed', location: 'Greenfield Park, B3', assets: '432', status: 'Active', statusColor: 'bg-secondary-container text-on-secondary-container' },
    { name: 'Human Resources', code: 'HR-02', head: 'Elena Kostic', initials: 'EK', headBg: 'bg-tertiary-fixed text-on-tertiary-fixed', location: 'Main Hub, Level 1', assets: '118', status: 'Active', statusColor: 'bg-secondary-container text-on-secondary-container' },
    { name: 'Customer Support', code: 'SUP-09', head: 'Thomas Wu', initials: 'TW', headBg: 'bg-outline-variant text-on-surface', location: 'Remote Operations', assets: '56', status: 'Pending', statusColor: 'bg-surface-variant text-on-surface-variant' },
    { name: 'Facilities & Logistics', code: 'LOG-03', head: 'Anita Bhat', initials: 'AB', headBg: 'bg-secondary-fixed-dim text-on-secondary-fixed-variant', location: 'Industrial Zone, WH2', assets: '892', status: 'Maintenance', statusColor: 'bg-error-container text-on-error-container' },
  ];

  const filtered = departments.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.head.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="font-body-md text-body-md">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
          {/* TopNavBar */}
          <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-sm">
            <div className="flex items-center gap-lg flex-1">
              <div className="relative w-full max-w-md">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-xl">search</span>
                <input
                  className="w-full pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-primary transition-all font-body-md"
                  placeholder="Search departments..."
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center gap-md">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
                <span className="material-symbols-outlined">help</span>
              </button>
              <div className="h-8 w-[1px] bg-outline-variant mx-sm"></div>
              <div className="flex items-center gap-sm cursor-pointer hover:bg-surface-container-low p-1 rounded-lg transition-colors">
                <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold text-xs overflow-hidden">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwqx_ozc0b70D-_vRO9BON-dYOpim4zajc3MIFu85GZfIKfmw949wP4IyAGCljZyv8gBZ-o1Mtdnn4K7RcJ3O1mY0e4kNnrLH8OWb2UDiQAafQze8bnRdswkqo1TRdwYDKqbfG3HYuhF0lKSNaeSxfMrafqRJcyA9R04--YXNvvmLAqqPiqhoxP4plTwyo6-WbDdLWEIxBRE-vqOe5rfAQcPwEg3hnAb4DOyCk_UqqHbmY_fEqY4Gcfg" alt="User" />
                </div>
                <span className="hidden lg:block font-label-md text-label-md text-on-surface">Alex Rivera</span>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 p-lg max-w-max-width mx-auto w-full">
            <section className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface">Departments</h2>
                <p className="text-on-surface-variant font-body-md mt-1">Manage and monitor organizational units and their assigned resources.</p>
              </div>
              <button className="flex items-center gap-sm bg-primary text-white px-lg py-sm rounded-lg font-label-md shadow-soft hover:bg-primary-container hover:text-on-primary-container transition-all active:scale-[0.98]">
                <span className="material-symbols-outlined text-lg">add</span>
                Add Department
              </button>
            </section>

            {/* Data Table */}
            <div className="bg-surface-container-lowest rounded-xl shadow-soft border border-outline-variant overflow-hidden">
              <div className="p-md border-b border-outline-variant flex items-center justify-between bg-white/50">
                <div className="flex items-center gap-md">
                  <div className="flex items-center gap-xs text-on-surface-variant">
                    <span className="font-label-md text-label-md">Filter:</span>
                    <button className="flex items-center gap-xs px-sm py-1 border border-outline-variant rounded-full text-xs font-label-sm hover:bg-surface-container-low transition-colors">
                      Status: Active <span className="material-symbols-outlined text-xs">expand_more</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" title="Export CSV">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                  <button className="p-2 text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors" title="Print View">
                    <span className="material-symbols-outlined">print</span>
                  </button>
                </div>
              </div>

              <div className="table-container overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/30">
                      {['Department Name', 'Head of Department', 'Location', 'Total Assets', 'Status', ''].map((h, i) => (
                        <th key={i} className={`px-lg py-md font-label-md text-label-md text-on-surface-variant border-b border-outline-variant ${h === 'Status' ? 'text-center' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filtered.map((row, i) => (
                      <tr key={i} className="hover:bg-surface-container transition-colors cursor-pointer">
                        <td className="px-lg py-lg">
                          <div className="flex flex-col">
                            <span className="text-on-surface font-semibold font-body-md">{row.name}</span>
                            <span className="text-xs text-on-surface-variant">Dept Code: {row.code}</span>
                          </div>
                        </td>
                        <td className="px-lg py-lg">
                          <div className="flex items-center gap-sm">
                            <div className={`w-7 h-7 rounded-full ${row.headBg} flex items-center justify-center text-[10px] font-bold`}>{row.initials}</div>
                            <span className="text-on-surface font-body-md">{row.head}</span>
                          </div>
                        </td>
                        <td className="px-lg py-lg text-on-surface-variant">{row.location}</td>
                        <td className="px-lg py-lg font-medium text-on-surface">{row.assets}</td>
                        <td className="px-lg py-lg text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.statusColor}`}>{row.status}</span>
                        </td>
                        <td className="px-lg py-lg text-right">
                          <button className="p-2 text-outline-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined">more_vert</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="p-md bg-white/80 border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-md">
                <span className="text-label-md font-label-md text-on-surface-variant">Showing {filtered.length} of {departments.length} departments</span>
                <div className="flex items-center gap-xs">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-30" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-white font-label-md transition-colors">1</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">2</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant hover:bg-surface-container-low transition-colors">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Insights */}
            <div className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-lg">
              {[
                { icon: 'trending_up', iconColor: 'text-secondary', label: 'Top Department', value: 'Engineering', detail: 'Grew by 12% in assets this quarter' },
                { icon: 'check_circle', iconColor: 'text-primary', label: 'Audit Compliance', value: '98.2%', detail: '22 departments verified this month' },
                { icon: 'error', iconColor: 'text-error', label: 'Pending Reviews', value: '04', detail: 'Actions required in Procurement' },
              ].map((card, i) => (
                <div key={i} className="p-lg bg-surface-container border border-outline-variant/30 rounded-xl">
                  <div className="flex items-center justify-between mb-sm">
                    <span className="text-label-md font-label-md text-on-surface-variant">{card.label}</span>
                    <span className={`material-symbols-outlined ${card.iconColor} text-lg`}>{card.icon}</span>
                  </div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">{card.value}</h4>
                  <p className="text-xs text-on-surface-variant mt-1">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="h-16 md:hidden"></div>
        </main>
      </div>

      {/* Mobile Bottom NavBar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface border-t border-outline-variant flex justify-around items-center py-2 z-50">
        {[{ icon: 'dashboard', label: 'Home' }, { icon: 'domain', label: 'Depts', active: true }, { icon: 'inventory', label: 'Assets' }, { icon: 'person', label: 'Profile' }].map((item, i) => (
          <a key={i} className={`flex flex-col items-center gap-1 ${item.active ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`} href="#">
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-[10px] font-label-sm">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
