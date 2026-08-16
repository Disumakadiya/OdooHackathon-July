import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  approveMaintenance, 
  rejectMaintenance, 
  assignTechnician, 
  startMaintenance, 
  resolveMaintenance 
} from '../../services/maintenanceService';

// Fallback manual fetch if getMaintenanceById isn't exported or defined
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function assetflow_maintenance_approval() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [technicianId, setTechnicianId] = useState('');

  useEffect(() => { 
    document.title = 'Maintenance Details | AssetFlow'; 
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/maintenances/${id}`);
      setRequest(response.data.data || response.data);
    } catch (error) {
      console.error("Failed to fetch request details", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      await approveMaintenance(id, comment);
      fetchRequestDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to approve');
    }
  };

  const handleReject = async () => {
    try {
      await rejectMaintenance(id, comment);
      fetchRequestDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to reject');
    }
  };

  const handleAssign = async () => {
    if (!technicianId) return alert('Please enter a Technician ID');
    try {
      await assignTechnician(id, parseInt(technicianId, 10));
      fetchRequestDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to assign');
    }
  };

  const handleStart = async () => {
    try {
      await startMaintenance(id);
      fetchRequestDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to start');
    }
  };

  const handleResolve = async () => {
    try {
      await resolveMaintenance(id, resolutionNotes);
      fetchRequestDetails();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to resolve');
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!request) {
    return <div className="flex h-screen items-center justify-center">Request not found</div>;
  }

  return (
    <div className="flex h-screen overflow-hidden font-body-md text-body-md">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-sm">
          <div className="flex items-center gap-md">
            <button onClick={() => navigate('/assetflow_maintenance_requests')} className="p-sm hover:bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Request #REQ-{request.id}</span>
              <h2 className="font-headline-md text-headline-md text-primary">Maintenance Details</h2>
            </div>
          </div>
        </header>

        <section className="max-w-max-width mx-auto p-lg mt-md">
          <div className="grid grid-cols-12 gap-gutter">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 space-y-lg">
              {/* Request Overview */}
              <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant/30">
                <div className="flex justify-between items-start mb-lg">
                  <div className="flex gap-md">
                    <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-3xl">build</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary mb-xs">{request.asset_name || `Asset #${request.asset_id}`}</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">Asset ID: <span className="font-mono text-primary font-semibold">{request.asset_tag || request.asset_id}</span></p>
                      <div className="flex gap-sm mt-sm">
                        <span className="px-sm py-base bg-error-container text-on-error-container text-label-sm rounded uppercase font-bold tracking-tighter">{request.priority} Priority</span>
                        <span className="px-sm py-base bg-secondary-container text-on-secondary-container text-label-sm rounded uppercase font-bold tracking-tighter">Status: {request.status}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-outline block mb-xs">Submitted by</span>
                    <div className="flex items-center justify-end gap-sm">
                      <span className="font-label-md font-semibold">{request.requester_name || `User ID ${request.requester_id}`}</span>
                    </div>
                    <span className="text-label-sm text-on-surface-variant mt-xs block">{new Date(request.created_at).toLocaleString()}</span>
                  </div>
                </div>

                <div className="p-md bg-surface-container border-l-4 border-primary rounded-r-lg mb-lg">
                  <h4 className="font-label-md font-bold text-primary uppercase tracking-wider mb-sm">Issue Description</h4>
                  <p className="text-body-md text-on-surface leading-relaxed">
                    {request.description}
                  </p>
                </div>
              </div>
              
              {/* Resolution Notes (If Resolved) */}
              {request.status === 'Resolved' && request.resolution_notes && (
                <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant/30">
                  <h4 className="font-label-md font-bold text-primary uppercase tracking-wider mb-sm">Resolution Notes</h4>
                  <p className="text-body-md text-on-surface leading-relaxed">
                    {request.resolution_notes}
                  </p>
                  <p className="text-label-sm text-outline mt-sm">Resolved At: {new Date(request.resolved_at).toLocaleString()}</p>
                </div>
              )}
            </div>

            {/* Right Column - Actions */}
            <div className="col-span-12 lg:col-span-4 space-y-lg">
              <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant/30 sticky top-[100px]">
                <h3 className="font-headline-md text-headline-md text-primary mb-md">Workflow Actions</h3>

                {request.status === 'Pending' && (
                  <>
                    <textarea
                      className="w-full mb-md bg-surface border border-outline-variant rounded-lg p-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none placeholder:text-outline/50"
                      placeholder="Manager comment (optional)..."
                      rows="3"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                    ></textarea>
                    <div className="flex flex-col gap-md">
                      <button onClick={handleApprove} className="w-full py-md bg-secondary text-white rounded-lg font-bold flex items-center justify-center gap-sm hover:brightness-110 active:opacity-80 transition-all shadow-sm">
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        Approve Request
                      </button>
                      <button onClick={handleReject} className="w-full py-md bg-white border-2 border-error text-error rounded-lg font-bold flex items-center justify-center gap-sm hover:bg-error/5 active:opacity-80 transition-all">
                        <span className="material-symbols-outlined">cancel</span>
                        Reject Request
                      </button>
                    </div>
                  </>
                )}

                {request.status === 'Approved' && (
                  <>
                    <label className="block mb-md">
                      <span className="text-label-md font-semibold mb-xs block">Assign Technician (ID)</span>
                      <input 
                        type="number"
                        className="w-full bg-surface border border-outline-variant rounded-lg p-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none"
                        placeholder="Enter Employee ID..."
                        value={technicianId}
                        onChange={e => setTechnicianId(e.target.value)}
                      />
                    </label>
                    <button onClick={handleAssign} className="w-full py-md bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-sm hover:brightness-110 active:opacity-80 transition-all shadow-sm">
                      <span className="material-symbols-outlined">person_add</span>
                      Assign Technician
                    </button>
                  </>
                )}

                {request.status === 'Technician Assigned' && (
                  <div className="flex flex-col gap-md">
                     <div className="p-md bg-surface-container rounded-lg border border-outline-variant">
                       <span className="block text-label-sm font-bold text-outline uppercase mb-xs">Assigned To</span>
                       <span className="block font-headline-md text-primary">{request.technician_name || `Employee #${request.technician_id}`}</span>
                     </div>
                    <button onClick={handleStart} className="w-full py-md bg-tertiary text-white rounded-lg font-bold flex items-center justify-center gap-sm hover:brightness-110 active:opacity-80 transition-all shadow-sm">
                      <span className="material-symbols-outlined">play_arrow</span>
                      Start Maintenance
                    </button>
                  </div>
                )}

                {request.status === 'In Progress' && (
                  <>
                     <div className="p-md mb-md bg-surface-container rounded-lg border border-outline-variant">
                       <span className="block text-label-sm font-bold text-outline uppercase mb-xs">Technician Working</span>
                       <span className="block font-headline-md text-primary">{request.technician_name || `Employee #${request.technician_id}`}</span>
                       <span className="block text-label-sm text-outline mt-xs">Started: {new Date(request.started_at).toLocaleString()}</span>
                     </div>
                    <textarea
                      className="w-full mb-md bg-surface border border-outline-variant rounded-lg p-md text-body-md focus:ring-2 focus:ring-secondary/20 outline-none placeholder:text-outline/50"
                      placeholder="Resolution notes (required)..."
                      rows="4"
                      value={resolutionNotes}
                      onChange={e => setResolutionNotes(e.target.value)}
                    ></textarea>
                    <button onClick={handleResolve} className="w-full py-md bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-sm hover:brightness-110 active:opacity-80 transition-all shadow-sm">
                      <span className="material-symbols-outlined">task_alt</span>
                      Mark as Resolved
                    </button>
                  </>
                )}

                {(request.status === 'Resolved' || request.status === 'Rejected') && (
                  <div className="p-md bg-surface-container rounded-lg border border-outline-variant flex items-center gap-sm text-on-surface-variant">
                    <span className="material-symbols-outlined">info</span>
                    <span>No further actions available. Request is {request.status.toLowerCase()}.</span>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}