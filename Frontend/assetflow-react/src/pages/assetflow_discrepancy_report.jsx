import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';

export default function assetflow_discrepancy_report() {
  useEffect(() => { document.title = 'Discrepancy Report | AssetFlow'; }, []);

  const rows = [
    { id: 'AST-9821', icon: 'laptop_mac', name: 'MacBook Pro M2 - 14"', serial: 'S/N: C02XG1...', category: 'IT Infrastructure', lastSeen: 'Jul 14, 2023', discrepancy: 'Missing', discColor: 'bg-error/10 text-error', value: '$2,499.00', statusDot: 'bg-outline', status: 'Investigation' },
    { id: 'AST-4412', icon: 'chair', name: 'Herman Miller Aeron', serial: 'Office: Level 4, B42', category: 'Furniture', lastSeen: 'Sep 01, 2023', discrepancy: 'Damaged', discColor: 'bg-tertiary-container/20 text-tertiary-container', value: '$1,650.00', statusDot: 'bg-secondary', status: 'Repair Sent' },
    { id: 'AST-1102', icon: 'videocam', name: 'Sony A7R IV Camera', serial: 'Marketing Dept', category: 'Media Gear', lastSeen: 'Aug 28, 2023', discrepancy: 'Missing', discColor: 'bg-error/10 text-error', value: '$3,500.00', statusDot: 'bg-error', status: 'Police Report' },
    { id: 'AST-0032', icon: 'print', name: 'HP Enterprise M507', serial: 'Floor 2 North', category: 'Office Equipment', lastSeen: 'Oct 12, 2023', discrepancy: 'Damaged', discColor: 'bg-tertiary-container/20 text-tertiary-container', value: '$799.00', statusDot: 'bg-outline', status: 'Assessment' },
  ];

  return (
    <div className="font-body-md text-body-md min-h-screen bg-surface-container-low">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* Top Navigation */}
        <header className="sticky top-0 z-40 bg-surface flex justify-between items-center w-full px-lg py-sm border-b border-outline-variant">
          <div className="flex items-center space-x-md flex-1">
            <div className="relative w-full max-w-sm">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-outline/70" placeholder="Search audit records..." type="text" />
            </div>
          </div>
          <div className="flex items-center space-x-md">
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full cursor-pointer">
              <span className="material-symbols-outlined">help</span>
            </button>
            <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full cursor-pointer relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <div className="h-8 w-8 rounded-full overflow-hidden border border-outline-variant">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaLaQ2_5qSkubhdg1Bm7QAOHlA-MyLykWzr1e43iDcxrSbmrUC4lx6YcXjZSH4ct6tbX6Fg4MDsUmPhVlEyoHkuEDGfX6aKjLWPhDs1ZcyOx_eAg9pMtcZIuqfR198Ak4wj9V8K8zG_c36BSbHID6GKCHCqLsqFC8mhfHkja4_sYnL4eL5B2zff7NQmCmBV_iSGz_A5oPiYJxTQKH-Ys7JqqOqn6ZTuTUVQ68Adh8du8m6musWG2KRag" alt="User" />
            </div>
          </div>
        </header>

        <section className="max-w-max-width mx-auto px-lg py-xl">
          {/* Header */}
          <div className="mb-xl flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
            <div>
              <nav className="flex items-center space-x-2 text-label-sm text-outline mb-sm">
                <span>Audit Registry</span>
                <span className="material-symbols-outlined text-[12px]">chevron_right</span>
                <span className="text-primary font-semibold">Discrepancy Report</span>
              </nav>
              <h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Discrepancy Report</h2>
              <p className="font-body-md text-on-surface-variant mt-xs">Identification and assessment of missing or damaged enterprise assets — Q3 2023 Audit.</p>
            </div>
            <div className="flex items-center space-x-sm">
              <button className="px-md py-sm bg-surface-container-highest text-primary font-label-md rounded-lg flex items-center hover:bg-outline-variant transition-colors border border-outline-variant">
                <span className="material-symbols-outlined mr-sm text-[20px]">filter_list</span> Filter
              </button>
              <button className="px-md py-sm bg-primary text-on-primary font-label-md rounded-lg flex items-center hover:opacity-90 active:scale-[0.98] transition-all ambient-shadow">
                <span className="material-symbols-outlined mr-sm text-[20px]">file_download</span> Export Report
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            {[
              { icon: 'running_with_errors', iconBg: 'bg-error/10 text-error', label: 'Missing Assets', value: '42 Units', badge: '+12%', badgeColor: 'text-error bg-error/10' },
              { icon: 'heart_broken', iconBg: 'bg-secondary/10 text-secondary', label: 'Damaged Items', value: '18 Units' },
              { icon: 'payments', iconBg: 'bg-primary-container/10 text-primary-container', label: 'Est. Liability', value: '$124,500' },
              { icon: 'history', iconBg: 'bg-tertiary-container/10 text-tertiary-container', label: 'Resolution Rate', value: '24.5%' },
            ].map((stat, i) => (
              <div key={i} className="bg-surface-container-lowest p-lg rounded-xl border border-outline-variant ambient-shadow">
                <div className="flex items-center justify-between mb-md">
                  <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                  {stat.badge && <span className={`text-label-sm font-bold ${stat.badgeColor} px-2 py-0.5 rounded`}>{stat.badge}</span>}
                </div>
                <p className="text-outline text-label-md">{stat.label}</p>
                <h3 className="text-headline-md font-bold text-on-surface">{stat.value}</h3>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant ambient-shadow overflow-hidden">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
              <h4 className="font-headline-md text-primary">Audit Findings Registry</h4>
              <div className="flex space-x-sm">
                <div className="flex items-center bg-surface-container px-sm py-1 rounded-md">
                  <span className="text-label-sm text-outline mr-sm">View:</span>
                  <button className="text-label-sm font-bold text-primary mr-sm">All</button>
                  <button className="text-label-sm text-outline hover:text-primary transition-colors">By Dept</button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    {['Asset ID', 'Description', 'Category', 'Last Seen', 'Discrepancy', 'Value', 'Status'].map(h => (
                      <th key={h} className="px-lg py-md font-label-md text-on-surface-variant">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container/30 transition-colors group hover:translate-x-1" style={{ transition: 'transform 0.2s ease-out' }}>
                      <td className="px-lg py-md font-label-md text-primary">{row.id}</td>
                      <td className="px-lg py-md">
                        <div className="flex items-center space-x-md">
                          <div className="w-10 h-10 rounded-md bg-surface-container flex-shrink-0 flex items-center justify-center">
                            <span className="material-symbols-outlined text-outline">{row.icon}</span>
                          </div>
                          <div>
                            <p className="font-label-md text-on-surface">{row.name}</p>
                            <p className="text-[10px] text-outline">{row.serial}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md text-on-surface-variant">{row.category}</td>
                      <td className="px-lg py-md text-on-surface-variant">{row.lastSeen}</td>
                      <td className="px-lg py-md">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${row.discColor} uppercase`}>{row.discrepancy}</span>
                      </td>
                      <td className="px-lg py-md font-label-md text-on-surface">{row.value}</td>
                      <td className="px-lg py-md text-outline">
                        <div className="flex items-center">
                          <span className={`w-2 h-2 rounded-full ${row.statusDot} mr-2`}></span>
                          {row.status}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-lg border-t border-outline-variant flex justify-between items-center bg-surface-container-low">
              <p className="text-label-sm text-outline">Showing 1 to 4 of 60 entries</p>
              <div className="flex space-x-xs">
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary text-label-sm font-bold">1</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors text-label-sm">2</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors text-label-sm">3</button>
                <button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-xl grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 bg-surface-container-low p-lg rounded-xl border border-outline-variant border-dashed flex items-center justify-center h-64 overflow-hidden relative group cursor-pointer">
              <div className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"
                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBtYCvHcF6NUrRC018KRHilziE4oVOkfGAxhC_gb7uubX_cj_017ZJ9paag2K_unAEj9vg8yUfzhuNFmMNbQ2c1wrA3EPTah2L9BS6G_rgd47ir_VTfbpA9FPc4kHsowZU9Hil6MliosTtrI4i0NmkJun_82giYasHSLTYkj7uTcqXfRhU0mfIg9Et1YI4ZSlJngiPeP3PFPpr8kv1Hejtk5NbDHcQM8BM2zQEdwtz8bE5wXc_4DbzWew')" }}>
              </div>
              <div className="relative z-10 text-center">
                <h5 className="font-headline-md text-primary mb-xs">Heatmap: High-Risk Zones</h5>
                <p className="text-on-surface-variant max-w-sm mx-auto">Visual audit distribution highlighting regions with recurring asset discrepancies.</p>
                <button className="mt-md px-md py-sm border border-primary text-primary font-label-md rounded-lg hover:bg-primary hover:text-on-primary transition-all">Expand Map Analysis</button>
              </div>
            </div>
            <div className="lg:col-span-1 space-y-gutter">
              <div className="bg-surface p-lg rounded-xl border border-outline-variant ambient-shadow">
                <h5 className="font-label-md text-primary mb-md border-b border-outline-variant pb-xs">Risk Mitigation Actions</h5>
                <ul className="space-y-md">
                  {[
                    { icon: 'check_circle', color: 'text-secondary', text: 'Relocated 12 high-value servers to secure zone Alpha.' },
                    { icon: 'check_circle', color: 'text-secondary', text: 'Updated RFID protocols for Marketing media kit.' },
                    { icon: 'pending', color: 'text-outline', text: 'Scheduled maintenance review for 3 damaged printers.', italic: true },
                  ].map((action, i) => (
                    <li key={i} className="flex items-start space-x-sm">
                      <span className={`material-symbols-outlined ${action.color} text-md`}>{action.icon}</span>
                      <p className={`text-label-sm text-on-surface-variant ${action.italic ? 'italic' : ''}`}>{action.text}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary-container p-lg rounded-xl text-on-primary-container">
                <p className="text-label-sm opacity-80 mb-xs">Next Scheduled Audit</p>
                <h4 className="font-headline-md font-bold mb-md">November 15, 2023</h4>
                <div className="flex items-center text-xs opacity-90">
                  <span className="material-symbols-outlined mr-xs text-sm">schedule</span>
                  9:00 AM — North Campus Warehouse
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FAB */}
      <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all z-50 md:hidden">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
