import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar';

const employees = [
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvchexR1iJct5NHAjbIH9eUCt9-Hjv8NPOv5qMoPa6sCZqCrJryAaK3tRtLnPesS-MSEvSJ71iT7SVG-u561YiuWiozDpNENOvm2S7uqBY8m44IpBVdHhe3l8bM1iv039cirGPthtI_jftFY2ua8ZkPR6NA2oV7IgUoOMHK97lDcbn9GPAXuZDX7GWxD9DxC_v0gvY0RWvBlcCNJF_wlr97v56T4Uy5NCRAFVvBNP9nVGk6GGyVzVXfQ', dept: 'Engineering', deptColor: 'bg-secondary-container text-on-secondary-container', id: 'AF-1029', name: 'Marcus Sterling', role: 'Senior Systems Architect', assetIcon: 'laptop_mac', assets: '12', status: 'Active', statusDot: 'bg-secondary' },
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA83MEs2vUx1GFzEbcspaZuNgIBmoKOWMbdpjTndvC-F4RN-8ge3YZ5fQEWrOhT09DfaLLIFCYGtYQ9cEJnk_cHUV_jN65xm2JFMxKIgkeoYfVrQYDUihxAIFlLZ6NyPy8qK1repyQn2-nshGlaiZHl0kKz7ay_qE6h5bMZWkB5e9N2xZAg14hGr0fZi0Crf1cl5kHF-7OJFknBCnYMrg_ssyMVHR3GsVyBkyysGSOtFY_F4e7OhVq-JQ', dept: 'Design', deptColor: 'bg-tertiary-fixed text-on-tertiary-fixed-variant', id: 'AF-1104', name: 'Elena Rodriguez', role: 'Lead UX Researcher', assetIcon: 'tablet', assets: '05', status: 'Active', statusDot: 'bg-secondary' },
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwuiW1IiMHsmQlAPpvJEh7DFg4ABzeMBMKDFjx1zroVa5WawZe2YB9_SqVNV5y-cgdjwVVEZesuX5BKpmrPbZitg1_HcgyrKxk7N1CYx6LEeErG3rhIKBy9zgHBq7eN0c_BgPyFLn27uM45eB2qHw3rJWmh20V83VTjO2MAxKGqg5M7Y3QpzqbYonlswQrI6BsqevoRbrIKebR9g_Qn55JqqEtXpjXBUYQAgyjHIjOn7QpqCcZTrNFTA', dept: 'Operations', deptColor: 'bg-primary-fixed text-on-primary-fixed-variant', id: 'AF-1088', name: 'James Thorne', role: 'Logistics Director', assetIcon: 'inventory_2', assets: '28', status: 'Active', statusDot: 'bg-secondary' },
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVECNUwp1rIeSb5jwm0kWnComeXaJegGdiv19HaxUze_mg6VIXAO4IBZRGt_4cQQfFM8rvrr4DvnYfxDrvwt6DL44xlU0Hdj6Sh9TlI0YkvYIBvkqCymgNFZo3-0yt80Yx9AkM9fKE_5pjgSOLhLhtXc73JyAhviEZ-jKPTqMM2Q6WmHX5zK8ADnOSz5FF09qQY9eLUICvP5OeX__sx6aYclx4sUjllz_-9xIQ9UZqLhXydhqk5EfGDw', dept: 'Marketing', deptColor: 'bg-outline-variant text-on-surface-variant', id: 'AF-1212', name: 'Sophia Chen', role: 'Global Brand Manager', assetIcon: 'devices_other', assets: '08', status: 'Active', statusDot: 'bg-secondary' },
  { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgQuQ0FEUsJlpIC9gvvA4Im04nNzxdQysLtN2WaKnPDMI-dkA8ONusm9wv-1a-tLGVi3k1PwmY5WLf_5m8kiXaS6HzF9RqnUdqW-Rhq_EUuzouMXW0XyilkrV9VLRRIduE3WizRLBItWoccwyinZPtB0Vpl9SJFcCZjzG9b7uyHqkRXl-4ao4Jf4aQwh6Wiz4k7ZGG0KXb6VUWrB8otsZDdpO3UDIBmr-t3cHf9d-QRhEZg_CwIKsAUg', dept: 'Finance', deptColor: 'bg-secondary-fixed text-on-secondary-container', id: 'AF-1045', name: 'David Miller', role: 'Senior Financial Analyst', assetIcon: 'monitor', assets: '04', status: 'On Leave', statusDot: 'bg-error' },
];

export default function assetflow_employee_directory() {
  useEffect(() => { document.title = 'Employee Directory | AssetFlow'; }, []);

  return (
    <div className="font-body-md text-body-md">
      <Sidebar />
      <main className="md:ml-64 min-h-screen bg-background transition-all duration-300">
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-sm">
          <div className="flex items-center gap-lg flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant opacity-60">search</span>
              <input className="w-full pl-xl pr-md py-sm bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-secondary/20 focus:border-primary outline-none transition-all font-body-md text-body-md" placeholder="Search employees by name, role, or asset..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-md ml-lg">
            <button className="p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-surface"></span>
            </button>
            <button className="p-sm text-on-surface-variant hover:bg-surface-container-low rounded-full transition-colors">
              <span className="material-symbols-outlined">help</span>
            </button>
          </div>
        </header>

        <div className="max-w-max-width mx-auto px-lg py-xl">
          <section className="mb-xl">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-lg">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Employee Directory</h2>
                <p className="text-on-surface-variant opacity-80 max-w-xl">Manage your workforce, track assigned hardware, and oversee departmental resources in one unified workspace.</p>
              </div>
              <div className="flex items-center gap-sm">
                <button className="flex items-center gap-sm px-lg py-sm bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                  Add Employee
                </button>
                <button className="flex items-center justify-center p-sm border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined">filter_list</span>
                </button>
              </div>
            </div>
            <div className="flex items-center gap-sm mt-lg overflow-x-auto no-scrollbar pb-xs">
              {['All Departments', 'Engineering', 'Design', 'Marketing', 'Operations', 'Human Resources', 'Finance'].map((dept, i) => (
                <button key={dept} className={`px-md py-base rounded-full font-label-sm text-label-sm whitespace-nowrap ${i === 0 ? 'bg-secondary text-on-secondary' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high transition-colors'}`}>
                  {dept}
                </button>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            {employees.map((emp, i) => (
              <div key={i} className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl custom-shadow flex flex-col hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-md">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm">
                    <img className="w-full h-full object-cover" src={emp.img} alt={emp.name} />
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-sm py-xs ${emp.deptColor} rounded font-label-sm text-label-sm mb-xs`}>{emp.dept}</span>
                    <span className="text-on-surface-variant opacity-60 font-label-sm text-label-sm">ID: {emp.id}</span>
                  </div>
                </div>
                <div className="mb-lg">
                  <h3 className="font-headline-md text-headline-md text-primary mb-xs">{emp.name}</h3>
                  <p className="text-on-surface-variant font-body-md text-body-md">{emp.role}</p>
                </div>
                <div className="mt-auto border-t border-outline-variant/30 pt-md grid grid-cols-2 gap-md">
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant opacity-60 font-label-sm text-label-sm mb-base uppercase tracking-wider">Assets</span>
                    <div className="flex items-center gap-xs">
                      <span className="material-symbols-outlined text-secondary text-[20px]">{emp.assetIcon}</span>
                      <span className="font-bold text-primary">{emp.assets}</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-on-surface-variant opacity-60 font-label-sm text-label-sm mb-base uppercase tracking-wider">Status</span>
                    <div className="flex items-center gap-xs">
                      <div className={`w-2 h-2 rounded-full ${emp.statusDot}`}></div>
                      <span className="font-label-md text-label-md">{emp.status}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-lg pt-sm hidden group-hover:block">
                  <button className="w-full py-sm bg-surface-container text-primary font-label-md text-label-md rounded-lg border border-outline-variant hover:bg-surface-container-high transition-colors">
                    View Assignment History
                  </button>
                </div>
              </div>
            ))}

            {/* Add Card */}
            <div className="border-2 border-dashed border-outline-variant p-lg rounded-xl flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-surface-container-low transition-all">
              <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary mb-md group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[32px]">add</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-primary mb-xs">New Employee</h3>
              <p className="text-on-surface-variant font-label-md text-label-md">Onboard a new member to the directory</p>
            </div>
          </section>

          <footer className="mt-xl flex items-center justify-between border-t border-outline-variant pt-lg">
            <p className="text-on-surface-variant font-label-md text-label-md">Showing 1-5 of 142 employees</p>
            <div className="flex items-center gap-xs">
              <button className="p-sm rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant disabled:opacity-30" disabled>
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-label-md text-label-md">1</button>
              <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface-variant">2</button>
              <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface-variant">3</button>
              <span className="px-sm text-on-surface-variant">...</span>
              <button className="w-10 h-10 rounded-lg hover:bg-surface-container-low transition-colors font-label-md text-label-md text-on-surface-variant">29</button>
              <button className="p-sm rounded-lg hover:bg-surface-container-low transition-colors text-on-surface-variant">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
