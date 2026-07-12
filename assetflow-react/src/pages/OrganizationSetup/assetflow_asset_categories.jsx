import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

export default function assetflow_asset_categories() {
  useEffect(() => {
    document.title = 'Asset Categories | AssetFlow';
    document.querySelectorAll('.bento-grid > div').forEach(card => {
      card.addEventListener('mouseenter', () => { card.style.transform = 'translateY(-4px)'; card.style.transition = 'transform 0.2s ease-out'; });
      card.addEventListener('mouseleave', () => { card.style.transform = 'translateY(0)'; });
    });
  }, []);

  const categories = [
    { icon: 'laptop_mac', iconBg: 'bg-primary-fixed-dim text-primary', name: 'IT Equipment', desc: 'Laptops, monitors, server racks, and peripherals across global offices.', total: '1,248', lastAudit: 'Oct 12, 2023', auditColor: 'text-on-surface', showAvatars: true },
    { icon: 'chair', iconBg: 'bg-secondary-container text-on-secondary-container', name: 'Furniture', desc: 'Ergonomic chairs, desks, lounge sets, and acoustic partitions.', total: '854', lastAudit: 'Jan 05, 2024', auditColor: 'text-on-surface', badge: { label: 'Up to Date', color: 'bg-secondary/10 text-secondary' } },
    { icon: 'directions_car', iconBg: 'bg-tertiary-fixed text-on-tertiary-fixed', name: 'Vehicles', desc: 'Corporate fleet, delivery vans, and specialized logistic transit units.', total: '42', lastAudit: 'Dec 15, 2023', auditColor: 'text-error', badge: { label: 'Overdue', color: 'bg-error/10 text-error' } },
    { icon: 'precision_manufacturing', iconBg: 'bg-surface-container-highest text-primary', name: 'Industrial Tools', desc: 'Precision machinery, maintenance kits, and specialized factory floor assets.', total: '312', lastAudit: 'Mar 02, 2024', auditColor: 'text-on-surface', showActive: true },
  ];

  return (
    <div className="bg-surface-container-low min-h-screen font-body-md text-on-surface">
      <Sidebar />

      <main className="ml-64 min-h-screen">
        {/* TopAppBar */}
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center w-full px-lg py-sm border-b border-outline-variant">
          <div className="flex items-center gap-md">
            <h1 className="font-headline-md text-headline-md font-bold text-primary">Asset Categories</h1>
          </div>
          <div className="flex items-center gap-lg">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input className="bg-surface-container border border-outline-variant rounded-full pl-10 pr-md py-1.5 text-label-md focus:ring-2 focus:ring-secondary/20 focus:border-primary outline-none transition-all w-64" placeholder="Search categories..." type="text" />
            </div>
            <div className="flex items-center gap-md">
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
              </button>
              <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="max-w-max-width mx-auto px-lg py-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-md mb-xl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Management Overview</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-xl">Organize and monitor enterprise hardware, furniture, and infrastructure. Track audit cycles and inventory density across departments.</p>
            </div>
            <button className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md flex items-center gap-sm hover:opacity-90 transition-opacity ambient-shadow active:scale-[0.98]">
              <span className="material-symbols-outlined">add</span>
              Create New Category
            </button>
          </div>

          <div className="bento-grid">
            {categories.map((cat, i) => (
              <div key={i} className="bg-surface-container-lowest rounded-[16px] p-lg ambient-shadow border border-outline-variant/30 hover:border-primary/20 transition-all group flex flex-col h-full">
                <div className="flex justify-between items-start mb-md">
                  <div className={`p-3 rounded-xl ${cat.iconBg}`}>
                    <span className="material-symbols-outlined text-[28px]">{cat.icon}</span>
                  </div>
                  <button className="p-1.5 text-outline hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{cat.name}</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-1">{cat.desc}</p>
                <div className="space-y-sm">
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                    <span className="font-label-md text-on-surface-variant">Total Assets</span>
                    <span className="font-label-md font-bold text-primary">{cat.total}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-outline-variant/20">
                    <span className="font-label-md text-on-surface-variant">Last Audit</span>
                    <span className={`font-label-md ${cat.auditColor}`}>{cat.lastAudit}</span>
                  </div>
                  <div className="pt-md flex items-center justify-between">
                    {cat.showAvatars && (
                      <div className="flex -space-x-2">
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTf_wRIsqMkhDiaPTaVVOgV61U0s5FsFOJqa1fT2xYp1B_V9Ew_nQjzAkgHkTHVoePF-EDqX-z9QC2E072Qzb7lp3vrFA9HR5jluR4bt4yKjaiFs5pDTIb2yAPIJaNibz7Bd-yuAn_Vr7M5fwYKxJjd805Jjmv10gFA1L1lJHCUqbPxfjq0tmHothfgTbBiMEbh0fPtsSN-_yvQMst0QvuBV2RVMGBjaCJpkzXoUPiKGekUzACS1BmJg" alt="" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest overflow-hidden">
                          <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBTCge_bmZUaqNKXQdS6hiAWX3WV9YkhhAlzFzSaPwZKXUfr3I8kYy4yxxqMtthoYgKr7BLvZXObujtnqN3FSWlbPLJrt60zQhXy3VnqhUjRMo9T3W_f_vuQUYxq-V1tji_3mf9g8WwjygeNMgWlNZ0wMykm6pcqSCgdl_qsqmZmWI45W4eakJOpHPP1wrXEC2niI5VL-XWxq34K9eEew4mfqkg2ulE-uCbrCZrbLdhTBukiDvA5hryTQ" alt="" />
                        </div>
                        <div className="w-8 h-8 rounded-full border-2 border-surface bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-on-surface-variant">+5</div>
                      </div>
                    )}
                    {cat.badge && (
                      <span className={`inline-flex items-center gap-xs px-2 py-1 rounded ${cat.badge.color} text-label-sm font-semibold uppercase tracking-wider`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {cat.badge.label}
                      </span>
                    )}
                    {cat.showActive && (
                      <div className="flex items-center gap-1 text-on-surface-variant">
                        <span className="material-symbols-outlined text-[16px]">history</span>
                        <span className="text-label-sm">Active</span>
                      </div>
                    )}
                    <a className="text-primary font-label-md flex items-center gap-xs group-hover:gap-sm transition-all" href="#">
                      View Details <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dashboard Visual Insight */}
          <section className="mt-xl grid grid-cols-1 md:grid-cols-3 gap-lg">
            <div className="md:col-span-2 bg-white rounded-[16px] p-lg ambient-shadow border border-outline-variant/30 relative overflow-hidden h-[300px]">
              <div className="relative z-10">
                <h4 className="font-headline-md text-primary mb-xs">Maintenance Flow</h4>
                <p className="font-body-md text-on-surface-variant mb-md">Real-time status of category-specific maintenance requests.</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full px-lg flex items-end justify-between h-40 gap-4 opacity-40">
                {[60, 100, 80, 70, 90, 50].map((h, i) => (
                  <div key={i} className={`${i % 2 === 0 ? 'bg-primary/20' : 'bg-secondary/20'} w-full rounded-t-lg`} style={{ height: `${h}%` }}></div>
                ))}
              </div>
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
            </div>

            <div className="bg-primary text-on-primary rounded-[16px] p-lg ambient-shadow flex flex-col justify-center items-center text-center relative overflow-hidden">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-[48px] mb-md">auto_awesome</span>
                <h4 className="font-headline-md mb-xs">Asset Intelligence</h4>
                <p className="font-label-md opacity-80 mb-lg px-4">Our AI-driven auditing predicts category depletion before it happens.</p>
                <button className="bg-white text-primary px-lg py-sm rounded-lg font-label-md hover:bg-surface-container-highest transition-colors">Enable Insights</button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-margin-mobile right-margin-mobile md:bottom-margin-desktop md:right-margin-desktop w-14 h-14 bg-secondary text-on-secondary rounded-xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </button>
    </div>
  );
}
