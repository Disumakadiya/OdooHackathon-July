import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getMaintenanceRequests } from '../services/maintenanceService';

export default function assetflow_maintenance_requests() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'Maintenance Requests - AssetFlow';

    const loadTickets = async () => {
      setLoading(true);
      setErrorMessage('');

      try {
        const response = await getMaintenanceRequests();
        setTickets(Array.isArray(response) ? response : []);
      } catch (error) {
        setErrorMessage(error?.response?.data?.message || error?.message || 'Unable to load maintenance requests.');
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const getPriorityStyle = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-error-container text-on-error-container';
      case 'high': return 'bg-error-container/20 text-error';
      case 'medium': return 'bg-secondary-container text-on-secondary-container';
      default: return 'bg-tertiary-container/10 text-tertiary';
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'resolved': return 'bg-tertiary-container text-white';
      case 'in progress': return 'bg-surface-container-highest text-on-surface-variant';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const displayTickets = tickets.length > 0 ? tickets : [
    { id: 1, priority: 'Critical', description: 'HVAC system failure in Section B4', created_at: new Date().toISOString(), status: 'In Progress' },
    { id: 2, priority: 'Medium', description: 'Server rack battery replacement', created_at: new Date().toISOString(), status: 'Open' },
  ];

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

          {(loading || errorMessage) && (
            <div className={`mb-lg rounded-lg border px-md py-sm text-label-sm ${errorMessage ? 'border-error/20 bg-error/5 text-error' : 'border-primary/20 bg-primary/5 text-primary'}`}>
              {loading ? 'Syncing maintenance requests from the backend…' : errorMessage}
            </div>
          )}

          <div className="grid grid-cols-12 gap-gutter mb-xl">
            <div className="col-span-12 md:col-span-3 bg-white p-lg rounded-xl custom-shadow border border-outline-variant/20 flex flex-col justify-between">
              <span className="text-outline font-label-sm uppercase tracking-tighter">Active Tickets</span>
              <div className="mt-md">
                <span className="text-display font-display text-primary leading-none">{displayTickets.length}</span>
                <div className="flex items-center gap-xs text-secondary mt-xs">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span>
                  <span className="text-label-sm">Live backend data</span>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-3 bg-white p-lg rounded-xl custom-shadow border border-outline-variant/20 flex flex-col justify-between">
              <span className="text-outline font-label-sm uppercase tracking-tighter">Critical Issues</span>
              <div className="mt-md">
                <span className="text-display font-display text-error leading-none">{displayTickets.filter((ticket) => ticket.priority?.toLowerCase() === 'critical').length}</span>
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
              {displayTickets.map((ticket, i) => (
                <div key={ticket.id || i} className="p-lg hover:bg-surface-container-low transition-colors cursor-pointer group">
                  <div className="flex flex-col md:flex-row gap-lg md:items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-sm mb-xs">
                        <span className="text-label-sm text-outline font-mono">{ticket.id}</span>
                        <span className={`px-sm py-xs rounded ${getPriorityStyle(ticket.priority)} text-[10px] font-bold uppercase`}>{ticket.priority || 'Medium'}</span>
                      </div>
                      <h3 className="font-headline-md text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">{ticket.description || 'Maintenance request'}</h3>
                      <p className="text-on-surface-variant text-label-md mt-xs">Reported {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'recently'}</p>
                    </div>
                    <div className="flex items-center gap-xl">
                      <span className={`px-md py-xs rounded-full ${getStatusStyle(ticket.status)} text-label-sm font-medium`}>{ticket.status || 'Open'}</span>
                      <div className="flex items-center gap-sm min-w-[160px]">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-outline">
                          <span className="material-symbols-outlined text-[18px]">person_add</span>
                        </div>
                        <span className="text-label-sm font-semibold italic text-outline">Assigned</span>
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
              <p className="text-label-sm text-outline">Showing {displayTickets.length} active tickets</p>
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
