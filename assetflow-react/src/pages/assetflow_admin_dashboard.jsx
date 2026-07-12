import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function assetflow_admin_dashboard() {
  useEffect(() => {
    document.title = 'AssetFlow - Enterprise Asset Management';
    const cards = document.querySelectorAll('.soft-elevation');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-2px)';
        card.style.transition = 'transform 0.2s ease-out';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
      });
    });
  }, []);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden">
      <Sidebar />

      {/* Main Content Area */}
      <main className="md:ml-64 min-h-screen">
        {/* TopNavBar */}
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-sm max-w-full">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="w-full bg-surface-container-low border-outline-variant rounded-full pl-10 pr-lg py-2 focus:ring-2 focus:ring-secondary/20 focus:border-primary transition-all outline-none font-label-md text-label-md" placeholder="Search assets, maintenance logs, or users..." type="text" />
            </div>
          </div>
          <div className="flex items-center space-x-md ml-lg">
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full cursor-pointer transition-colors">notifications</button>
            <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-2 rounded-full cursor-pointer transition-colors">help</button>
            <div className="h-8 w-[1px] bg-outline-variant"></div>
            <div className="hidden sm:block text-right">
              <p className="font-label-sm text-label-sm text-on-surface-variant">Central Hub</p>
              <p className="font-label-md text-label-md font-bold text-primary">London - HQ</p>
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-lg max-w-max-width mx-auto">
          <div className="mb-xl">
            <h2 className="font-display text-display text-primary leading-tight">Dashboard</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-base">Welcome back, Thorne. Here's an overview of the fleet status today.</p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-lg mb-xl">
            <div className="bg-surface-container-lowest p-lg rounded-xl soft-elevation flex flex-col justify-between border border-white hover:border-outline-variant/30 transition-all">
              <div>
                <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-primary">inventory</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">Total Assets</p>
                <h3 className="font-headline-lg text-headline-lg text-primary mt-xs">2,842</h3>
              </div>
              <p className="font-label-sm text-label-sm text-secondary flex items-center mt-md">
                <span className="material-symbols-outlined text-[16px] mr-1">trending_up</span>
                +12% from last month
              </p>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-xl soft-elevation flex flex-col justify-between border border-white hover:border-outline-variant/30 transition-all">
              <div>
                <div className="w-10 h-10 bg-secondary/5 rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-secondary">handyman</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">Active Maintenance</p>
                <h3 className="font-headline-lg text-headline-lg text-primary mt-xs">48</h3>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant mt-md">14 high priority alerts</p>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-xl soft-elevation flex flex-col justify-between border border-white hover:border-outline-variant/30 transition-all">
              <div>
                <div className="w-10 h-10 bg-tertiary-container/10 rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-tertiary">fact_check</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">Audit Progress</p>
                <h3 className="font-headline-lg text-headline-lg text-primary mt-xs">92%</h3>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full mt-md">
                <div className="bg-secondary h-full rounded-full w-[92%]"></div>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-lg rounded-xl soft-elevation flex flex-col justify-between border border-white hover:border-outline-variant/30 transition-all">
              <div>
                <div className="w-10 h-10 bg-error/5 rounded-lg flex items-center justify-center mb-md">
                  <span className="material-symbols-outlined text-error">pending_actions</span>
                </div>
                <p className="font-label-md text-label-md text-on-surface-variant">Pending Approvals</p>
                <h3 className="font-headline-lg text-headline-lg text-primary mt-xs">07</h3>
              </div>
              <button className="font-label-md text-label-md text-primary font-bold text-left underline hover:text-primary-container transition-colors mt-md">Review now</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
            {/* Maintenance Alerts */}
            <section className="lg:col-span-8 bg-surface-container-lowest rounded-xl soft-elevation border border-white">
              <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md text-primary">Maintenance Alerts</h3>
                <button className="font-label-md text-label-md text-secondary font-semibold hover:underline">View Schedule</button>
              </div>
              <div className="p-lg">
                <div className="space-y-md">
                  {[
                    { icon: 'desktop_windows', name: 'Precision Workstation X-200', dept: 'Creative Design · Serial: 994-002', info: 'Next Service', status: 'In 2 days', badge: 'Sage Ready' },
                    { icon: 'local_shipping', name: 'Distribution Fleet Truck #42', dept: 'Logistics · Reg: AX-202-LG', info: 'Status', status: 'Overdue', isError: true, badge: 'Sage Ready' },
                    { icon: 'router', name: 'Server Rack 04 - Core Switches', dept: 'IT Infrastructure · Room 2B', info: 'Next Service', status: 'In 14 days', badge: 'Sage Ready' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-md hover:bg-surface-container transition-colors rounded-lg border border-transparent hover:border-outline-variant/20">
                      <div className="flex items-center space-x-md">
                        <div className="p-base">
                          <span className="material-symbols-outlined text-primary text-[28px]">{item.icon}</span>
                        </div>
                        <div>
                          <p className="font-label-md text-label-md font-bold text-on-surface">{item.name}</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">Dept: {item.dept}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-lg">
                        <div className="text-right hidden sm:block">
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{item.info}</p>
                          <p className={`font-label-md text-label-md ${item.isError ? 'text-error' : 'text-primary'}`}>{item.status}</p>
                        </div>
                        <span className="bg-secondary-container text-on-secondary-container px-sm py-1 rounded-sm font-label-sm text-label-sm uppercase tracking-wide font-bold">{item.badge}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="lg:col-span-4 bg-surface-container-lowest rounded-xl soft-elevation border border-white">
              <div className="p-lg border-b border-outline-variant/30">
                <h3 className="font-headline-md text-headline-md text-primary">Recent Activity</h3>
              </div>
              <div className="p-lg">
                <div className="relative">
                  <div className="absolute left-[19px] top-2 bottom-2 w-[1px] bg-outline-variant/40"></div>
                  <div className="space-y-lg">
                    {[
                      { icon: 'logout', color: 'text-primary', fill: false, name: 'Sarah Jenks', action: 'checked out', asset: 'MacBook Pro #029', time: '10 minutes ago' },
                      { icon: 'login', color: 'text-secondary', fill: true, name: 'Audit Team', action: 'completed inspection for', asset: 'Facility A', time: '2 hours ago' },
                      { icon: 'logout', color: 'text-primary', fill: false, name: 'Marcus Aurel', action: 'checked out', asset: 'Test Kit Beta', time: 'Yesterday, 4:45 PM' },
                      { icon: 'login', color: 'text-secondary', fill: true, name: 'Reception', action: 'checked in', asset: 'ID Badge #921', time: 'Yesterday, 9:20 AM' },
                    ].map((activity, i) => (
                      <div key={i} className="relative pl-xl">
                        <div className="absolute left-0 top-1 w-10 h-10 bg-white border border-outline-variant/50 rounded-full flex items-center justify-center z-10">
                          <span className={`material-symbols-outlined ${activity.color} text-[18px]`} style={activity.fill ? { fontVariationSettings: "'FILL' 1" } : {}}>{activity.icon}</span>
                        </div>
                        <p className="font-label-md text-label-md text-on-surface"><strong>{activity.name}</strong> {activity.action} <span className="text-primary font-bold">{activity.asset}</span></p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">{activity.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button className="w-full mt-xl py-sm bg-surface-container text-primary font-bold rounded-lg hover:bg-surface-container-high transition-colors font-label-md text-label-md">View All History</button>
              </div>
            </section>
          </div>

          {/* Visual Insight Banner */}
          <div className="mt-xl h-64 rounded-xl relative overflow-hidden soft-elevation border border-white group">
            <div
              className="absolute inset-0 bg-cover bg-center scale-105 group-hover:scale-100 transition-transform duration-1000"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuANe3IBlXTbmMLsEV_-8vkgKB1EMWGLLKR6B-uCV_SBRywbafPGyoC4TQNWcQlIeT3Hs8sndw7BK67GVE2F4bv56W7ypEhtlNYpCTQ5bo7CF4SpK1lDRvvEfC51ive6eGqRKuBYK7gOKwXAlvq43TJ4iQOCU6eV9qQi6cWTUx2XboU2XJGJ0gCEz-vX6DRCyULj7ZNa8vtooGMVpTyjellyViMtHbcujIysw88P4D_Xozdkn1kFtonIqQ')" }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-transparent flex flex-col justify-center px-xl">
              <h4 className="font-display text-headline-lg text-white max-w-md">Streamlining Asset Visibility</h4>
              <p className="text-white/90 font-body-md text-body-md max-w-sm mt-sm">Your new real-time tracking modules are now active across all Western Europe hubs.</p>
              <div className="mt-lg">
                <button className="bg-white text-primary px-lg py-sm rounded-lg font-bold font-label-md text-label-md hover:bg-surface-container-low transition-colors">Explore Fleet Map</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full soft-elevation flex items-center justify-center hover:bg-primary-container active:scale-95 transition-all shadow-xl z-50 group">
        <span className="material-symbols-outlined text-[24px]">add</span>
        <span className="absolute right-full mr-md px-md py-sm bg-primary text-white rounded-lg text-label-md font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">Register New Asset</span>
      </button>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low border-t border-outline-variant flex justify-around items-center h-16 z-50">
        <button className="flex flex-col items-center justify-center space-y-xs text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
          <span className="font-label-sm text-label-sm font-bold">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-xs text-on-surface-variant">
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="font-label-sm text-label-sm">Assets</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-xs text-on-surface-variant">
          <span className="material-symbols-outlined">build</span>
          <span className="font-label-sm text-label-sm">Fix</span>
        </button>
        <button className="flex flex-col items-center justify-center space-y-xs text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="font-label-sm text-label-sm">Profile</span>
        </button>
      </nav>
    </div>
  );
}
