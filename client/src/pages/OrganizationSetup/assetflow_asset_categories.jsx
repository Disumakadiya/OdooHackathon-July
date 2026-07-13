import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import SummaryCard from '../../components/SummaryCard';
import SearchFilter from '../../components/SearchFilter';
import CategoryCard from '../../components/CategoryCard';
import CategoryModal from '../../components/CategoryModal';
import CategoryDrawer from '../../components/CategoryDrawer';

export default function assetflow_asset_categories() {
  useEffect(() => { document.title = 'Asset Categories | AssetFlow'; }, []);

  const initial = [
    { id: 1, icon: 'laptop_mac', iconBg: 'bg-primary-fixed-dim text-primary', name: 'IT Equipment', desc: 'Laptops, monitors, server racks, and peripherals across global offices.', total: '1,248', lastAudit: 'Oct 12, 2023', auditColor: 'text-on-surface', showAvatars: true, avatar1: 'https://i.pravatar.cc/40?img=10', avatar2: 'https://i.pravatar.cc/40?img=12', extra: 5, status: 'active' },
    { id: 2, icon: 'chair', iconBg: 'bg-secondary-container text-on-secondary-container', name: 'Furniture', desc: 'Ergonomic chairs, desks, lounge sets, and acoustic partitions.', total: '854', lastAudit: 'Jan 05, 2024', auditColor: 'text-on-surface', badge: { label: 'Up to Date', color: 'bg-secondary/10 text-secondary' }, status: 'active' },
    { id: 3, icon: 'directions_car', iconBg: 'bg-tertiary-fixed text-on-tertiary-fixed', name: 'Vehicles', desc: 'Corporate fleet, delivery vans, and specialized logistic transit units.', total: '42', lastAudit: 'Dec 15, 2023', auditColor: 'text-error', badge: { label: 'Overdue', color: 'bg-error/10 text-error' }, status: 'inactive' },
    { id: 4, icon: 'precision_manufacturing', iconBg: 'bg-surface-container-highest text-primary', name: 'Industrial Tools', desc: 'Precision machinery, maintenance kits, and specialized factory floor assets.', total: '312', lastAudit: 'Mar 02, 2024', auditColor: 'text-on-surface', showActive: true, status: 'active' },
  ];

  const [categories, setCategories] = useState(initial);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [createOpen, setCreateOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);

  const totals = useMemo(() => ({
    totalCategories: categories.length,
    totalAssets: categories.reduce((s, c) => s + Number(String(c.total).replace(/[^0-9]/g, '')) || 0, 0),
    active: categories.filter(c => c.status === 'active').length,
    inactive: categories.filter(c => c.status === 'inactive').length,
  }), [categories]);

  const filtered = useMemo(() => categories.filter(c => {
    if (status !== 'all' && c.status !== status) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q);
  }), [categories, search, status]);

  function handleCreate(data) {
    const next = { id: Date.now(), name: data.name || 'New Category', desc: data.desc || '', icon: 'category', iconBg: 'bg-primary-fixed-dim text-primary', total: '0', lastAudit: '—', auditColor: 'text-on-surface', status: 'active' };
    setCategories([next, ...categories]);
    setCreateOpen(false);
  }

  function handleView(cat) { setActiveCategory(cat); setDrawerOpen(true); }
  function handleEdit(cat) { setCreateOpen(true); /* could prefill in modal */ }
  function handleDelete(cat) { setCategories(categories.filter(c => c.id !== cat.id)); }

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
            <div className="hidden md:block">
              <div className="flex items-center gap-2">
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full relative">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
                </button>
                <button className="p-2 text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
                  <span className="material-symbols-outlined">help</span>
                </button>
              </div>
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
            <div className="w-full md:w-auto">
              <SearchFilter search={search} setSearch={setSearch} status={status} setStatus={setStatus} onCreate={() => setCreateOpen(true)} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-lg">
            <SummaryCard title="Total Categories" value={totals.totalCategories} />
            <SummaryCard title="Total Assets" value={totals.totalAssets} />
            <SummaryCard title="Active" value={totals.active} />
            <SummaryCard title="Inactive" value={totals.inactive} />
          </div>

          <div className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {filtered.map((cat) => (
              <CategoryCard key={cat.id} category={cat} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>

          {/* Dashboard Visual Insight (kept as original) */}
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

      <CategoryModal open={createOpen} onClose={() => setCreateOpen(false)} onSave={handleCreate} />
      <CategoryDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} category={activeCategory} />

      {/* FAB (kept) */}
      <button onClick={() => setCreateOpen(true)} className="fixed bottom-margin-mobile right-margin-mobile md:bottom-margin-desktop md:right-margin-desktop w-14 h-14 bg-secondary text-on-secondary rounded-xl shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
        <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'wght' 600" }}>add</span>
      </button>
    </div>
  );
}
