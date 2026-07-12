import { useEffect } from 'react';
import Sidebar from '../components/Sidebar';

const tickets = [
  { id: 'MT-8942', priority: 'Critical', priorityColor: 'bg-error-container text-on-error-container', title: 'HVAC System Failure - Section B4', reported: 'Reported 2 hours ago by Facilities Lead', status: 'In Progress', statusColor: 'bg-surface-container-highest text-on-surface-variant', assignee: { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJgI2B1UzsAsHQh0oOp4HP2xR2-rJcpubW1Q3BOxz95K96rkz6UN9qL-FpStc0Atsb1y7_aFGr1c5hhlm5lsGTHwrcba_v35uSIxpPc0nHZL4IKlaa0LhCpaCt7n4lQyoYG2tjrYpw1MX4oY8NxC75jmYt_Blmnfy8IellEf53wpmka5bt9lC0xVaKYspy0PxiU-XimfRou_N2cnRR_y6KZ1jgu7-5UlAHr07l_EhOs6t0Vqs_NhG1Zw', name: 'Marcus Chen', role: 'Lead Engineer' } },
  { id: 'MT-8941', priority: 'Normal', priorityColor: 'bg-secondary-container text-on-secondary-container', title: 'Server Rack #12 - Battery Replacement', reported: 'Reported 5 hours ago by IT Dept', status: 'Pending', statusColor: 'bg-surface-container-high text-on-surface-variant', assignee: null },
  { id: 'MT-8940', priority: 'Low', priorityColor: 'bg-tertiary-container/10 text-tertiary', title: 'Workspace A2 - Ergonomic Adjustment', reported: 'Reported 1 day ago by Sarah Jenkins', status: 'Complete', statusColor: 'bg-tertiary-container text-white', assignee: { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEcxX6sg8H6xnHLrFtaog4dBgSGtxBRI8uqtJK5xf1xxzBHxm8EtLs6H-NEsdM04hn4e2MffEmHPqCJfVZtVvKdxNEqnFn4YPy0CwW6TeDPkZlupV6uQDNxsPOkaXDN-dZR3BFPjzaCovSn1YgWrIINwY-KiBP1rlN3CF49IP_b51EaoEpHnHtEZIahNBt88nz_5cA4d-FfC_QRO8eazhVSb0r-XkBAbpqTPuXktl9nE8sTij8qXXpVg', name: 'Jessica Vane', role: 'Field Tech' } },
  { id: 'MT-8939', priority: 'High', priorityColor: 'bg-error-container/20 text-error', title: 'Freight Elevator 2 - Sensor Malfunction', reported: 'Reported 2 days ago by Logistics Team', status: 'In Progress', statusColor: 'bg-surface-container-highest text-on-surface-variant', assignee: { img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLIpTTVFpV5vGxxoEoNYN27y_WPyiDhMPB7ktqt42rz-7rttsiQ7b4CqGIMda7uSVbklQqWCJ_bVBohR7n8Ww4eO4J3LZzB_ELkgQUn5KRv1TC2jSib2iE5u3u796zsiVfFvAoDFr_YiS3T8GNroEiBVy4J257Zk77tHHE_bJ0HrmXWy9V1hzAk0H8RQ6EZrMHKDCT2Ib6xBr23g_G_eUMPb0Y0og0mk7nYwbUm0-bDucyhh96EBPvKA', name: 'Robert Gale', role: 'Master Tech' } },
];

export default function assetflow_maintenance_requests() {
  useEffect(() => { document.title = 'Maintenance Requests - AssetFlow'; }, []);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden">
      <Sidebar />

      <header className="md:ml-64 sticky top-0 z-40 bg-surface border-b border-outline-variant w-full max-w-max-width mx-auto flex justify-between items-center px-lg py-sm">
        <div className="flex items-center gap-md">
          <button className="md:hidden p-sm hover:bg-surface-container-low rounded-full">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <div className="relative group hidden sm:block">
            <span className="material-symbols-outlined absolute left-sm top-1/2 -translate-y-1/2 text-outline">search</span>
            <input className="pl-xl pr-md py-sm rounded-lg border border-outline-variant bg-surface-container-low text-label-md focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-primary transition-all w-64 md:w-80" placeholder="Search tickets..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-sm text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border border-surface"></span>
          </button>
          <button className="p-sm text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-full">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </header>

      <main className="md:ml-64 min-h-screen pt-xl pb-xl px-lg">
        <div className="max-w-max-width mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Maintenance Requests</h2>
              <p className="text-on-surface-variant font-body-md">Manage equipment health and ongoing facility maintenance tasks.</p>
            </div>
            <button className="flex items-center gap-sm px-lg py-md bg-secondary text-on-secondary rounded-lg font-label-md custom-shadow hover:opacity-90 active:scale-95 transition-all">
              <span className="material-symbols-outlined">add</span>
              New Request
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-12 gap-gutter mb-xl">
            <div className="col-span-12 md:col-span-3 bg-white p-lg rounded-xl custom-shadow border border-outline-variant/20 flex flex-col justify-between">
              <span className="text-outline font-label-sm uppercase tracking-tighter">Active Tickets</span>
              <div className="mt-md">
                <span className="text-display font-display text-primary leading-none">24</span>
                <div className="flex items-center gap-xs text-secondary mt-xs">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="text-label-sm">8% vs last week</span>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 bg-white p-lg rounded-xl custom-shadow border border-outline-variant/20 flex flex-col justify-between">
              <span className="text-outline font-label-sm uppercase tracking-tighter">Critical Issues</span>
              <div className="mt-md">
                <span className="text-display font-display text-error leading-none">05</span>
                <p className="text-label-sm text-on-surface-variant mt-xs">Requires immediate action</p>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 bg-tertiary-container text-white p-lg rounded-xl custom-shadow relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-md">
                  <span className="text-on-tertiary-container font-label-sm uppercase tracking-tighter">Technician Availability</span>
                  <span className="material-symbols-outlined opacity-50">engineering</span>
                </div>
                <div className="flex -space-x-2">
                  {['https://lh3.googleusercontent.com/aida-public/AB6AXuBKO-N_yQTlwCgJUp5FcelIZ-R5ofQqh4lx1cVmIpkAqFlqc_5DkoI-8AK1uqfA-7wyvJg5tbF-lAI353AxlPr6CyY3YOx-peAwfI-pjpGHtHG6A9jLVPXHi3y6G28JWd4_75DlQ1DSq_nMiAVUnI7WWsMts2ZWXsptswhCThT61hQNrLJQwC8D7Tz4_K0LDOaDNFvfsyOg8oI_kjLWJjboBW-k81wxn4RbJOBwtL2PpvoV98IV8wSMlQ', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDqSjWZGDM42-ngo-wSr43TsZcqLRKe55SaYOXuF9gz465JQsZA7f9lbNLmtNp3Z3R3sQIut63e0sKTJt7qPLxhmpq3ycW1EPHs-XxjbTPZISVn6UYyvQuNiNvtNNet_lE36Rg760YRrB3VbH1GabVN3tMzUAVdvGDyyVMaPqMyHBs2HLqub4-WSLwCHetOkhA6Fdvrpq3xZ9PgKjWSQD-kOsBkwmsSH-RAkCtR7ou8nGi9z8MiE2kOLA', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNIKV7IOoUxwV3sgsbqeSVSUrV6tflAdXUZKRtqUhmAkmvPvLqLLlGYmb5WM2qa4YYS6O5qCBMx4zXYZkKI3EI7yCb3uyYV0NBDdUhKixNDvH5NlvA7P1wpPrjL3er_s3N5rpBxeQxP5BIEfawVvgUoeg6Zt3cPwFVrL9SD6EmPAhAfbyLQHERDzkD2qtRgIUhWPp7ozhlQFhPbejOCIzAjOeXUE47AGANCoAUoMtY0jG1Gy0waFcm-Q'].map((src, i) => (
                    <img key={i} className="w-10 h-10 rounded-full border-2 border-tertiary-container" src={src} alt="" />
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-tertiary-container bg-surface-container-highest text-primary flex items-center justify-center font-label-md">+4</div>
                </div>
                <p className="mt-md text-on-tertiary-container text-label-md">86% of staff currently assigned to active maintenance tasks.</p>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          <div className="bg-white rounded-xl custom-shadow border border-outline-variant/20 overflow-hidden">
            <div className="px-lg py-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-md bg-surface-container-lowest">
              <div className="flex gap-md overflow-x-auto no-scrollbar w-full sm:w-auto">
                {['All Tickets', 'Active', 'Scheduled', 'Completed'].map((tab, i) => (
                  <button key={tab} className={`pb-base border-b-2 font-label-md whitespace-nowrap ${i === 0 ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-surface transition-colors'}`}>{tab}</button>
                ))}
              </div>
              <div className="flex items-center gap-sm">
                <button className="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-lg text-label-sm hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span> Filter
                </button>
                <button className="flex items-center gap-xs px-sm py-xs border border-outline-variant rounded-lg text-label-sm hover:bg-surface-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]">sort</span> Priority
                </button>
              </div>
            </div>

            <div className="divide-y divide-outline-variant">
              {tickets.map((ticket, i) => (
                <div key={i} className="p-lg hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <div className="flex flex-col md:flex-row gap-lg md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="text-label-sm text-outline font-mono">{ticket.id}</span>
                        <span className={`px-sm py-xs rounded ${ticket.priorityColor} text-[10px] font-bold uppercase`}>{ticket.priority}</span>
                      </div>
                      <h3 className="font-headline-md text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">{ticket.title}</h3>
                      <p className="text-on-surface-variant text-label-md mt-xs">{ticket.reported}</p>
                    </div>
                    <div className="flex items-center gap-xl">
                      <span className={`px-md py-xs rounded-full ${ticket.statusColor} text-label-sm font-medium`}>{ticket.status}</span>
                      <div className="flex items-center gap-sm min-w-[160px]">
                        {ticket.assignee ? (
                          <>
                            <img className="w-8 h-8 rounded-full border border-outline-variant" src={ticket.assignee.img} alt={ticket.assignee.name} />
                            <div className="flex flex-col">
                              <span className="text-label-sm font-semibold">{ticket.assignee.name}</span>
                              <span className="text-[10px] text-outline">{ticket.assignee.role}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline">
                              <span className="material-symbols-outlined text-[18px]">person_add</span>
                            </div>
                            <span className="text-label-sm font-semibold italic text-outline">Unassigned</span>
                          </>
                        )}
                      </div>
                      <button className="p-sm text-outline hover:text-primary rounded-full hover:bg-surface-container">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-lg py-md border-t border-outline-variant flex justify-between items-center bg-surface-container-low">
              <p className="text-label-sm text-outline">Showing 4 of 24 active tickets</p>
              <div className="flex gap-xs">
                <button className="p-sm border border-outline-variant rounded-lg hover:bg-surface-container disabled:opacity-30" disabled>
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button className="p-sm border border-outline-variant rounded-lg hover:bg-surface-container">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <button className="md:hidden fixed bottom-lg right-lg w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center custom-shadow active:scale-90 transition-transform z-50">
        <span className="material-symbols-outlined">add</span>
      </button>
    </div>
  );
}
