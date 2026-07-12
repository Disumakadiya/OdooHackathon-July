import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

export default function assetflow_audit_dashboard() {
  useEffect(() => {
    document.title = 'AssetFlow | Audit Dashboard';
    const cards = document.querySelectorAll('.notion-card');
    cards.forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(10px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, index * 100);
    });
  }, []);

  return (
    <div className="font-body-md text-body-md selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      <Sidebar />

      <header className="md:ml-64 sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-sm max-w-full">
        <div className="flex items-center flex-1 max-w-xl">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="w-full bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 font-label-md text-label-md focus:ring-2 focus:ring-secondary/20 transition-all" placeholder="Search audits, records, or departments..." type="text" />
          </div>
        </div>
        <div className="flex items-center space-x-md ml-lg">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="md:ml-64 p-lg min-h-screen">
        <div className="max-w-max-width mx-auto">
          <div className="mb-xl">
            <nav className="flex items-center space-x-2 text-outline font-label-sm text-label-sm mb-sm">
              <a className="hover:text-primary" href="#">Dashboard</a>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-on-surface-variant">Audit Overview</span>
            </nav>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Audit Dashboard</h2>
                <p className="text-on-surface-variant mt-1 font-body-md max-w-lg">Monitoring corporate compliance and asset integrity across all operational sectors.</p>
              </div>
              <div className="flex gap-sm">
                <button className="flex items-center px-md py-2 bg-white border border-outline-variant text-primary font-label-md rounded-lg hover:bg-surface-container transition-all">
                  <span className="material-symbols-outlined mr-2 text-[20px]">download</span> Export Report
                </button>
                <button className="flex items-center px-md py-2 bg-primary text-on-primary font-label-md rounded-lg shadow-sm hover:opacity-90 transition-all">
                  <span className="material-symbols-outlined mr-2 text-[20px]">add</span> New Audit Cycle
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
            <div className="notion-card p-lg rounded-xl md:col-span-1">
              <div className="flex items-center justify-between mb-sm">
                <span className="text-outline font-label-md uppercase tracking-wider">Compliance Score</span>
                <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
              </div>
              <div className="flex items-baseline space-x-sm">
                <h3 className="font-display text-[40px] leading-none text-on-surface">94.2%</h3>
                <span className="text-secondary font-label-sm flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +2.1%
                </span>
              </div>
              <div className="mt-md h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-secondary w-[94.2%] rounded-full"></div>
              </div>
            </div>

            <div className="notion-card p-lg rounded-xl md:col-span-1">
              <div className="flex items-center justify-between mb-sm">
                <span className="text-outline font-label-md uppercase tracking-wider">Active Audits</span>
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>pending_actions</span>
              </div>
              <div className="flex items-baseline space-x-sm">
                <h3 className="font-display text-[40px] leading-none text-on-surface">12</h3>
                <span className="text-outline font-label-sm">cycles</span>
              </div>
              <p className="text-on-surface-variant font-label-sm mt-md">3 cycles ending this week</p>
            </div>

            <div className="notion-card p-lg rounded-xl md:col-span-2 relative overflow-hidden">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <span className="text-outline font-label-md uppercase tracking-wider">Discrepancy Alerts</span>
                  <div className="flex items-center space-x-md mt-sm">
                    <h3 className="font-display text-[40px] text-error">04</h3>
                    <div className="px-3 py-1 bg-error/10 text-error rounded-full font-label-sm">High Priority</div>
                  </div>
                </div>
                <p className="text-on-surface-variant font-body-md mt-lg">Recent anomalies detected in Logistics and IT Infrastructure sectors require immediate review.</p>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[120px] text-error">warning</span>
              </div>
            </div>
          </div>

          {/* Audit Cycles */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
            <div className="lg:col-span-2 notion-card p-lg rounded-xl">
              <div className="flex items-center justify-between mb-lg">
                <h3 className="font-headline-md text-headline-md text-on-surface">Audit Cycle Progress</h3>
                <div className="flex space-x-2">
                  <span className="px-2 py-1 bg-surface-container-low border border-outline-variant rounded text-[12px] font-label-md">Q3 2023</span>
                </div>
              </div>
              <div className="space-y-lg">
                {[
                  { label: 'Warehouse IT Assets', tag: 'ANNUAL', tagColor: 'bg-tertiary/10 text-tertiary', progress: 75, color: 'bg-primary', start: 'Oct 12', due: 'Nov 15' },
                  { label: 'Financial Records - EU North', tag: 'COMPLIANCE', tagColor: 'bg-secondary/10 text-secondary', progress: 42, color: 'bg-secondary', start: 'Nov 01', due: 'Dec 01' },
                  { label: 'Physical Security Systems', tag: 'QUARTERLY', tagColor: 'bg-primary/10 text-primary', progress: 98, color: 'bg-tertiary', start: 'Sep 20', due: 'Oct 31 (Overdue)' },
                ].map((item, i) => (
                  <div key={i} className="group">
                    <div className="flex justify-between items-center mb-sm">
                      <div>
                        <span className="font-label-md text-on-surface">{item.label}</span>
                        <span className={`ml-2 px-2 py-0.5 ${item.tagColor} rounded text-[10px] font-bold`}>{item.tag}</span>
                      </div>
                      <span className="font-label-sm text-outline">{item.progress}% Complete</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.progress}%` }}></div>
                    </div>
                    <div className="flex justify-between mt-2 text-[11px] text-outline">
                      <span>Started: {item.start}</span>
                      <span>Due: {item.due}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1 notion-card p-lg rounded-xl flex flex-col">
              <h3 className="font-headline-md text-headline-md text-on-surface mb-lg">Discrepancy Log</h3>
              <div className="space-y-md flex-1 overflow-y-auto custom-scrollbar pr-2">
                {[
                  { color: 'bg-error', title: 'Unaccounted Hardware', desc: '14x High-spec Workstations missing from Dublin data center.', time: '2 hours ago' },
                  { color: 'bg-secondary', title: 'Software License Overload', desc: 'Cloud subscription usage exceeds limit in Marketing dept.', time: '5 hours ago' },
                  { color: 'bg-primary', title: 'Maintenance Interval Lag', desc: 'Industrial HVAC units overdue for Q3 inspection.', time: 'Yesterday' },
                ].map((log, i) => (
                  <div key={i} className="p-md rounded-lg bg-surface-container-low border border-outline-variant/30 hover:border-error/30 transition-colors">
                    <div className="flex items-start justify-between">
                      <span className={`w-2 h-2 rounded-full ${log.color} mt-2`}></span>
                      <div className="flex-1 ml-md">
                        <p className="font-label-md text-on-surface leading-tight">{log.title}</p>
                        <p className="text-label-sm text-on-surface-variant mt-1">{log.desc}</p>
                        <div className="flex items-center mt-md text-[11px] text-outline">
                          <span className="material-symbols-outlined text-[14px] mr-1">schedule</span> {log.time}
                        </div>
                      </div>
                      <button className="text-outline hover:text-primary"><span className="material-symbols-outlined">more_vert</span></button>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-lg text-primary font-label-md hover:underline flex items-center justify-center">
                View All Reports <span className="material-symbols-outlined ml-1 text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="notion-card p-lg rounded-xl overflow-hidden mb-xl">
            <div className="flex items-center justify-between mb-lg">
              <h3 className="font-headline-md text-headline-md text-on-surface">Departmental Integrity Scan</h3>
              <div className="flex items-center space-x-md">
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-secondary"></span><span className="text-label-sm text-on-surface-variant">Optimal</span></div>
                <div className="flex items-center space-x-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-label-sm text-on-surface-variant">Needs Review</span></div>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant">
                    {['Department', 'Last Audit', 'Assets Scanned', 'Status', 'Compliance'].map(h => (
                      <th key={h} className={`${h === 'Compliance' ? 'text-right' : 'text-left'} py-md px-sm text-outline font-label-sm uppercase tracking-wider`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {[
                    { dept: 'Human Resources', audit: 'Oct 24, 2023', assets: '412 Units', status: 'Secure', statusColor: 'bg-secondary-fixed text-on-secondary-fixed', compliance: '99.8%', compColor: 'text-primary' },
                    { dept: 'Engineering & R&D', audit: 'Nov 02, 2023', assets: '1,250 Units', status: 'Pending', statusColor: 'bg-primary-fixed text-on-primary-fixed', compliance: '87.5%', compColor: 'text-primary' },
                    { dept: 'Logistics & Fleet', audit: 'Oct 15, 2023', assets: '892 Units', status: 'Discrepancy', statusColor: 'bg-error-container text-on-error-container', compliance: '72.1%', compColor: 'text-error' },
                    { dept: 'IT Infrastructure', audit: 'Sep 28, 2023', assets: '4,200 Units', status: 'Secure', statusColor: 'bg-secondary-fixed text-on-secondary-fixed', compliance: '94.0%', compColor: 'text-primary' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-lg px-sm font-label-md text-on-surface">{row.dept}</td>
                      <td className="py-lg px-sm text-on-surface-variant">{row.audit}</td>
                      <td className="py-lg px-sm text-on-surface-variant">{row.assets}</td>
                      <td className="py-lg px-sm"><span className={`px-2 py-1 ${row.statusColor} text-[10px] font-bold rounded uppercase`}>{row.status}</span></td>
                      <td className={`py-lg px-sm text-right font-headline-md ${row.compColor}`}>{row.compliance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visual */}
          <div className="mt-xl relative rounded-3xl overflow-hidden h-64 notion-card group">
            <img className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAurn6R7v5AoIwSzvZEKtKYl8jWQdQ7gecUYFbs5UfqhkP-ejEBcl5kuiDPIpqkoSnRpfKcYtAukBX5wigDU6-BCgGvU5l6VWubMzFgbmSL6xSqeWLe2UdsvgLEgXdtuXI2R1Uo0_yxxOpD1cr1s6-3kfa76cOx6c7RvrNautk02lxIrUFLb3izk6DxMvXhIoUpulWQGeanTLtz5402rIbCypBhKmJ7LSdbkDeCn-OPdZVQ8KRx0RRr0Q" alt="Audit" />
            <div className="absolute inset-0 bg-gradient-to-r from-surface to-transparent flex items-center px-xl">
              <div className="max-w-md">
                <h4 className="font-headline-lg text-headline-lg text-primary mb-md">Audit Integrity Pledge</h4>
                <p className="text-on-surface-variant font-body-md italic border-l-2 border-primary pl-md">"Integrity is doing the right thing, even when no one is watching. Our systems ensure that every asset has a story, and every story is verified."</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant flex justify-around items-center py-sm z-50">
        {[{ icon: 'dashboard', label: 'Home' }, { icon: 'fact_check', label: 'Audit', active: true }, { icon: 'assessment', label: 'Reports' }, { icon: 'settings', label: 'Settings' }].map((item, i) => (
          <a key={i} className={`flex flex-col items-center p-2 ${item.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`} href="#">
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-[10px] font-label-md">{item.label}</span>
          </a>
        ))}
      </nav>
    </div>
  );
}
