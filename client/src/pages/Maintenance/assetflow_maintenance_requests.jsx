import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { getMaintenanceRequests, createMaintenanceRequest } from '../../services/maintenanceService';

export default function assetflow_maintenance_requests() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All Tickets');
  
  // New request state
  const [newRequest, setNewRequest] = useState({
    asset_id: '',
    description: '',
    priority: 'Medium'
  });

  useEffect(() => { 
    document.title = 'Maintenance Requests - AssetFlow'; 
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getMaintenanceRequests();
      setRequests(data || []);
    } catch (error) {
      console.error("Failed to fetch maintenance requests", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createMaintenanceRequest({
        asset_id: parseInt(newRequest.asset_id, 10),
        description: newRequest.description,
        priority: newRequest.priority
      });
      setIsModalOpen(false);
      setNewRequest({ asset_id: '', description: '', priority: 'Medium' });
      fetchRequests();
    } catch (error) {
      console.error("Failed to create request", error);
      alert(error.response?.data?.message || "Failed to create request");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-error-container text-on-error-container';
      case 'High': return 'bg-error-container/20 text-error';
      case 'Medium': return 'bg-secondary-container text-on-secondary-container';
      case 'Low': return 'bg-tertiary-container/10 text-tertiary';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-surface-container-high text-on-surface-variant';
      case 'Approved': return 'bg-secondary-container text-on-secondary-container';
      case 'Rejected': return 'bg-error-container text-on-error-container';
      case 'Technician Assigned': return 'bg-tertiary-container text-white';
      case 'In Progress': return 'bg-surface-container-highest text-on-surface-variant';
      case 'Resolved': return 'bg-primary text-white';
      default: return 'bg-surface-container-high text-on-surface-variant';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden font-body-md text-body-md">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant w-full flex justify-between items-center px-lg py-sm">
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

        <main className="flex-1 overflow-y-auto pt-xl pb-xl px-lg relative">
          <div className="max-w-max-width mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-md">
              <div>
                <h2 className="font-headline-lg text-headline-lg text-primary mb-xs">Maintenance Requests</h2>
                <p className="text-on-surface-variant font-body-md">Manage equipment health and ongoing facility maintenance tasks.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-sm px-lg py-md bg-secondary text-on-secondary rounded-lg font-label-md custom-shadow hover:opacity-90 active:scale-95 transition-all">
                <span className="material-symbols-outlined">add</span>
                New Request
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-12 gap-gutter mb-xl">
              <div className="col-span-12 md:col-span-3 bg-white p-lg rounded-xl custom-shadow border border-outline-variant/20 flex flex-col justify-between">
                <span className="text-outline font-label-sm uppercase tracking-tighter">Active Tickets</span>
                <div className="mt-md">
                  <span className="text-display font-display text-primary leading-none">{requests.length}</span>
                </div>
              </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white rounded-xl custom-shadow border border-outline-variant/20 overflow-hidden">
              <div className="px-lg py-md border-b border-outline-variant flex flex-col sm:flex-row justify-between items-center gap-md bg-surface-container-lowest">
                <div className="flex gap-md overflow-x-auto no-scrollbar w-full sm:w-auto">
                  {['All Tickets', 'Pending', 'In Progress', 'Resolved'].map((tab) => (
                    <button 
                      key={tab} 
                      onClick={() => setActiveTab(tab)}
                      className={`pb-base border-b-2 font-label-md whitespace-nowrap ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-outline hover:text-on-surface transition-colors'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-outline-variant">
                {loading ? (
                  <div className="p-lg text-center text-outline">Loading...</div>
                ) : requests.filter(r => activeTab === 'All Tickets' || r.status === activeTab).length === 0 ? (
                  <div className="p-lg text-center text-outline">No maintenance requests found.</div>
                ) : requests.filter(r => activeTab === 'All Tickets' || r.status === activeTab).map((ticket, i) => (
                  <div 
                    key={ticket.id} 
                    onClick={() => navigate(`/assetflow_maintenance_approval/${ticket.id}`)}
                    className="p-lg hover:bg-surface-container-low transition-colors cursor-pointer group"
                  >
                    <div className="flex flex-col md:flex-row gap-lg md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-sm mb-xs">
                          <span className="text-label-sm text-outline font-mono">REQ-{ticket.id}</span>
                          <span className={`px-sm py-xs rounded ${getPriorityColor(ticket.priority)} text-[10px] font-bold uppercase`}>{ticket.priority}</span>
                        </div>
                        <h3 className="font-headline-md text-body-lg font-semibold text-on-surface group-hover:text-primary transition-colors">{ticket.asset_name || `Asset #${ticket.asset_id}`}</h3>
                        <p className="text-on-surface-variant text-label-md mt-xs">{ticket.description}</p>
                        <p className="text-outline text-label-sm mt-xs">Reported on {new Date(ticket.created_at).toLocaleDateString()} by {ticket.requester_name || 'System'}</p>
                      </div>
                      <div className="flex items-center gap-xl">
                        <span className={`px-md py-xs rounded-full ${getStatusColor(ticket.status)} text-label-sm font-medium`}>{ticket.status}</span>
                        <div className="flex items-center gap-sm min-w-[160px]">
                          {ticket.technician_name ? (
                            <div className="flex flex-col">
                              <span className="text-label-sm font-semibold">{ticket.technician_name}</span>
                              <span className="text-[10px] text-outline">Assigned Technician</span>
                            </div>
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
                          <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl p-lg w-full max-w-md">
            <h2 className="text-headline-md font-bold mb-md text-primary">New Maintenance Request</h2>
            <form onSubmit={handleSubmit} className="space-y-md">
              <div>
                <label className="block text-label-md font-bold text-on-surface-variant mb-xs">Asset ID</label>
                <input 
                  type="number" 
                  required
                  value={newRequest.asset_id}
                  onChange={(e) => setNewRequest({...newRequest, asset_id: e.target.value})}
                  className="w-full border border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Enter numerical Asset ID"
                />
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface-variant mb-xs">Description</label>
                <textarea 
                  required
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                  className="w-full border border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary outline-none min-h-[100px]" 
                  placeholder="Describe the issue..."
                />
              </div>
              <div>
                <label className="block text-label-md font-bold text-on-surface-variant mb-xs">Priority</label>
                <select 
                  value={newRequest.priority}
                  onChange={(e) => setNewRequest({...newRequest, priority: e.target.value})}
                  className="w-full border border-outline-variant rounded-lg p-sm focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="flex justify-end gap-sm mt-lg">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-md py-sm rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-md py-sm rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}