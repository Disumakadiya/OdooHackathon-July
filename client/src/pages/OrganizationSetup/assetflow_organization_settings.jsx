import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/Sidebar';

export default function assetflow_organization_settings() {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  useEffect(() => { document.title = 'AssetFlow | Organization Settings'; }, []);

  const tabs = [
    { id: 'profile', icon: 'person', label: 'Profile' },
    { id: 'security', icon: 'security', label: 'Security' },
    { id: 'integrations', icon: 'extension', label: 'Integrations' },
    { id: 'billing', icon: 'payments', label: 'Billing' },
  ];

  return (
    <div className="bg-surface-container-low font-body-md text-on-surface min-h-screen">
      <header className="sticky top-0 z-40 flex justify-between items-center w-full px-lg py-sm bg-surface border-b border-outline-variant max-w-full mx-auto">
        <div className="flex items-center gap-md">
          <span className="text-headline-md font-headline-md font-bold text-primary">AssetFlow</span>
          <div className="hidden md:flex ml-lg gap-lg">
            <nav className="flex gap-md">
              <a className="text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low px-sm py-xs transition-colors rounded" href="#">Dashboard</a>
              <a className="text-on-surface-variant font-label-md text-label-md hover:bg-surface-container-low px-sm py-xs transition-colors rounded" href="#">Departments</a>
              <a className="text-primary font-semibold font-label-md text-label-md px-sm py-xs rounded" href="#">Settings</a>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <div className="relative hidden md:block">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline-variant">search</span>
            <input className="pl-xl pr-md py-xs rounded-lg border border-outline-variant bg-surface-container-lowest text-sm w-64" placeholder="Quick search..." type="text" />
          </div>
          <button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container-low p-sm rounded-full transition-colors">notifications</button>
          <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center overflow-hidden border border-outline-variant">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC3OxYc4SU9ZIJnbJPDcugIEx6EGlelAC8GyLUvdJqPAsj98H_gxPRCejfKp3q4pBpsXwA1OcPHt82Hspt-kq5Buu7j5Zhv3qXEtEwrpEoWiY515pdaDzMZiCJegurHG1c9moGrUdEq83DIRETJ_SnN86WjhoRvEDbMI9-uOKebO5eJwnQSM5TjwBwEGtQtuGuExjdGNF1uiQiJI1iDYMWqs-fieeGFFDphe4egPNtOCHY1TkgKzrC7aQ" alt="User" />
          </div>
        </div>
      </header>

      <div className="flex max-w-max-width mx-auto min-h-[calc(100vh-64px)]">
        {/* Settings Sidebar */}
        <aside className="w-64 flex flex-col p-md space-y-base border-r border-outline-variant hidden md:flex">
          <div className="mb-lg px-sm">
            <h2 className="font-headline-md text-headline-md text-primary mb-xs">Organization</h2>
            <p className="font-label-md text-label-md text-on-surface-variant opacity-70">Enterprise Management</p>
          </div>
          <nav className="space-y-sm">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-md w-full px-md py-sm text-left transition-all hover:bg-surface-container duration-200 rounded-lg ${activeTab === tab.id ? 'text-primary font-bold bg-surface-container-highest' : 'text-on-surface-variant'}`}
              >
                <span className="material-symbols-outlined">{tab.icon}</span>
                <span className="font-label-md text-label-md">{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-lg md:p-xl overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <section className="space-y-xl">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="font-headline-lg text-headline-lg text-primary">Organization Profile</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Update your company's identity and global assets.</p>
                  </div>
                  <button className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded-lg hover:opacity-90 active:scale-95 transition-all soft-shadow">Save Changes</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl">
                  <div className="md:col-span-1 bg-surface-container-lowest p-lg rounded-xl soft-shadow border border-outline-variant/30 flex flex-col items-center justify-center">
                    <div className="w-24 h-24 rounded-full bg-surface-container-high border-2 border-dashed border-outline-variant flex flex-col items-center justify-center cursor-pointer hover:bg-surface-container transition-colors mb-md group">
                      <span className="material-symbols-outlined text-outline-variant group-hover:scale-110 transition-transform">add_a_photo</span>
                      <span className="text-xs text-outline mt-xs">Update Logo</span>
                    </div>
                    <p className="text-center font-label-sm text-label-sm text-on-surface-variant">Recommended size: 512x512px. PNG or SVG format.</p>
                  </div>

                  <div className="md:col-span-2 bg-surface-container-lowest p-lg rounded-xl soft-shadow border border-outline-variant/30 space-y-md">
                    <div className="space-y-xs">
                      <label className="font-label-md text-label-md text-on-surface-variant">Organization Name</label>
                      <input className="w-full px-md py-sm rounded-lg border border-outline-variant bg-transparent text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-primary transition-all" type="text" defaultValue="AssetFlow Enterprise" />
                    </div>
                    <div className="space-y-xs">
                      <label className="font-label-md text-label-md text-on-surface-variant">Domain</label>
                      <div className="flex items-center">
                        <input className="flex-1 px-md py-sm rounded-l-lg border border-outline-variant bg-transparent text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-primary transition-all" type="text" defaultValue="assetflow.io" />
                        <span className="px-md py-[11px] bg-surface-container-high border-y border-r border-outline-variant rounded-r-lg text-label-sm text-outline font-label-sm">Primary</span>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 bg-surface-container-lowest p-lg rounded-xl soft-shadow border border-outline-variant/30">
                    <h3 className="font-headline-md text-headline-md text-primary mb-md">Regional Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                      <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant">Timezone</label>
                        <select className="w-full px-md py-sm rounded-lg border border-outline-variant bg-transparent text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all">
                          <option>(GMT-08:00) Pacific Time</option>
                          <option>(GMT-05:00) Eastern Time</option>
                          <option>(GMT+00:00) London</option>
                        </select>
                      </div>
                      <div className="space-y-xs">
                        <label className="font-label-md text-label-md text-on-surface-variant">Locale</label>
                        <select className="w-full px-md py-sm rounded-lg border border-outline-variant bg-transparent text-body-md focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all">
                          <option>English (United States)</option>
                          <option>English (United Kingdom)</option>
                          <option>French (France)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Logout Section */}
                <div className="pt-xl mt-lg border-t border-outline-variant/30 flex justify-between items-center">
                  <div>
                    <h3 className="font-headline-md text-headline-md text-error mb-xs">Sign Out</h3>
                    <p className="text-sm text-on-surface-variant">Securely end your current session.</p>
                  </div>
                  <button onClick={() => logout()} className="flex items-center gap-2 px-6 py-2.5 border border-error text-error rounded-lg hover:bg-error/10 transition-colors font-medium text-sm">
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Sign Out
                  </button>
                </div>
              </section>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <section className="space-y-xl">
                <div>
                  <h1 className="font-headline-lg text-headline-lg text-primary">Security & Access</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-sm">Manage authentication protocols and system access logs.</p>
                </div>
                <div className="space-y-lg">
                  <div className="bg-surface-container-lowest p-lg rounded-xl soft-shadow border border-outline-variant/30 flex items-center justify-between">
                    <div className="flex gap-md items-start">
                      <div className="p-sm bg-tertiary-fixed rounded-lg text-tertiary">
                        <span className="material-symbols-outlined">key</span>
                      </div>
                      <div>
                        <h4 className="font-headline-md text-[18px] text-primary">Two-Factor Authentication</h4>
                        <p className="text-label-md text-on-surface-variant">Add an extra layer of security to user logins across the organization.</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input defaultChecked className="sr-only peer" type="checkbox" />
                      <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                    </label>
                  </div>
                  <div className="bg-surface-container-lowest p-lg rounded-xl soft-shadow border border-outline-variant/30">
                    <h4 className="font-headline-md text-[18px] text-primary mb-md">Password Requirements</h4>
                    <ul className="space-y-sm">
                      {[
                        { icon: 'check_circle', color: 'text-secondary', text: 'Minimum 12 characters', checked: true },
                        { icon: 'check_circle', color: 'text-secondary', text: 'Must include special characters', checked: true },
                        { icon: 'circle', color: 'text-outline-variant', text: 'Require quarterly password rotation', checked: false },
                      ].map((req, i) => (
                        <li key={i} className="flex items-center gap-sm text-body-md">
                          <span className={`material-symbols-outlined ${req.color} text-[20px]`} style={req.checked ? { fontVariationSettings: "'FILL' 1" } : {}}>{req.icon}</span>
                          {req.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Integrations Tab */}
            {activeTab === 'integrations' && (
              <section className="py-xl text-center">
                <span className="material-symbols-outlined text-display text-outline-variant mb-md" style={{ fontSize: '64px' }}>extension</span>
                <h2 className="text-headline-md text-primary mt-md">Integrations Module</h2>
                <p className="text-on-surface-variant max-w-sm mx-auto mt-sm">Connect your workspace to external tools like Slack, Jira, and SAP.</p>
                <button className="mt-lg px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all">Explore Integrations</button>
              </section>
            )}

            {/* Billing Tab */}
            {activeTab === 'billing' && (
              <section className="py-xl text-center">
                <span className="material-symbols-outlined text-outline-variant mb-md" style={{ fontSize: '64px' }}>payments</span>
                <h2 className="text-headline-md text-primary mt-md">Billing & Plans</h2>
                <p className="text-on-surface-variant max-w-sm mx-auto mt-sm">Manage your subscription, view invoices, and update payment methods.</p>
                <button className="mt-lg px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-all">Manage Billing</button>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface flex justify-around items-center h-16 border-t border-outline-variant px-md z-50">
        {[{ icon: 'dashboard', label: 'Home' }, { icon: 'category', label: 'Assets' }, { icon: 'settings', label: 'Settings', active: true }].map((item, i) => (
          <button key={i} className={`flex flex-col items-center ${item.active ? 'text-primary' : 'text-on-surface-variant'}`}>
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-[10px] font-label-sm">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
