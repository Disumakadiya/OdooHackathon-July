import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getMaintenanceRequests, updateMaintenanceRequest } from '../services/maintenanceService';

export default function assetflow_maintenance_approval() {
  const [comment, setComment] = useState('');
  const [approved, setApproved] = useState(null);
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    document.title = 'Maintenance Approval | AssetFlow';
    loadRequest();
  }, []);

  const loadRequest = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await getMaintenanceRequests();
      const firstRequest = Array.isArray(response) && response.length > 0 ? response[0] : null;
      setRequest(firstRequest);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Unable to load maintenance request details.');
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async (decision) => {
    if (!request) return;

    setIsUpdating(true);
    setApproved(null);

    try {
      const nextStatus = decision ? 'Resolved' : 'Open';
      const updated = await updateMaintenanceRequest(request.id, {
        asset_id: request.asset_id,
        requester_id: request.requester_id,
        description: request.description,
        priority: request.priority,
        status: nextStatus,
        cost: request.cost,
      });
      setRequest(updated);
      setApproved(decision);
      setComment((prev) => prev || (decision ? 'Approved via backend integration.' : 'Rejected via backend integration.'));
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Unable to update maintenance request.');
    } finally {
      setIsUpdating(false);
    }
  };

  const currentRequest = request || {
    id: 'MNT-2024-089',
    description: 'System reporting intermittent power fluctuations in the laser diode assembly.',
    priority: 'Critical',
    status: 'Open',
    asset_id: 'AST-98231-MFG',
    cost: 4250,
    requester_id: 1,
    created_at: '2024-10-14T09:42:00',
  };

  return (
    <div className="font-body-md text-body-md">
      <Sidebar />

      <main className="md:ml-64 min-h-screen">
        <header className="sticky top-0 z-40 bg-surface border-b border-outline-variant flex justify-between items-center w-full px-lg py-sm">
          <div className="flex items-center gap-md">
            <button className="md:hidden p-sm hover:bg-surface-container-low rounded-full">
              <span className="material-symbols-outlined">menu</span>
            </button>
            <div className="flex flex-col">
              <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">Request #{currentRequest.id}</span>
              <h2 className="font-headline-md text-headline-md text-primary">Maintenance Approval</h2>
            </div>
          </div>
          <div className="flex items-center space-x-md">
            <div className="relative hidden sm:block">
              <input className="bg-surface-container-low border-outline-variant border rounded-full px-lg py-xs text-label-md focus:ring-2 focus:ring-secondary/20 focus:border-primary outline-none transition-all w-64" placeholder="Search assets..." type="text" />
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline text-md">search</span>
            </div>
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">notifications</span>
            </button>
            <div className="h-8 w-8 rounded-full bg-surface-container-highest overflow-hidden border border-outline-variant">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB5us0u7hRSJmJjmZ_cCcqEoNsTk5IrXkkOv_iiCbsODOSljDxnDFfpnuOT9rOuQhTLmDhs0dzUHa1ka5-FhH28tMppX2D57uS3_LK5dfmBOInmeNkvPpvwOYjUKyuld9Sw49tJ0K4PuW-Sv-JWZdZlPRQ8Co5uyQhaflWl_Cawv8Xuc73AOK_nGZQvMO9YSmgBiHsdToP7y5pskm9elnl1qGbhQtJkcwnNB_sXL-kVeD85lOPmokU7Cw" alt="User" />
            </div>
          </div>
        </header>

        <section className="max-w-max-width mx-auto p-lg mt-md">
          <nav className="flex items-center space-x-sm mb-lg text-label-md text-on-surface-variant opacity-60">
            <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <a className="hover:text-primary transition-colors" href="#">Maintenance Queue</a>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-on-surface font-semibold">Approval Details</span>
          </nav>

          {(loading || errorMessage) && (
            <div className={`mb-lg rounded-lg border px-md py-sm text-label-sm ${errorMessage ? 'border-error/20 bg-error/5 text-error' : 'border-primary/20 bg-primary/5 text-primary'}`}>
              {loading ? 'Loading approval details from the backend…' : errorMessage}
            </div>
          )}

          <div className="grid grid-cols-12 gap-gutter">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 space-y-lg">
              {/* Request Overview */}
              <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant/30">
                <div className="flex justify-between items-start mb-lg">
                  <div className="flex gap-md">
                    <div className="w-16 h-16 rounded-xl bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-3xl">precision_manufacturing</span>
                    </div>
                    <div>
                      <h3 className="font-headline-md text-headline-md text-primary mb-xs">Industrial Laser Cutter X12</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant">Asset ID: <span className="font-mono text-primary font-semibold">{currentRequest.asset_id}</span></p>
                      <div className="flex gap-sm mt-sm">
                        <span className={`px-sm py-base text-label-sm rounded uppercase font-bold tracking-tighter ${currentRequest.priority?.toLowerCase() === 'critical' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>{currentRequest.priority || 'Medium'} Priority</span>
                        <span className="px-sm py-base bg-secondary-container text-on-secondary-container text-label-sm rounded uppercase font-bold tracking-tighter">Manufacturing Dept.</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-outline block mb-xs">Submitted by</span>
                    <div className="flex items-center justify-end gap-sm">
                      <span className="font-label-md font-semibold">{currentRequest.requester_id || 'Manager'}</span>
                      <div className="w-6 h-6 rounded-full bg-tertiary-fixed border border-outline-variant"></div>
                    </div>
                    <span className="text-label-sm text-on-surface-variant mt-xs block">{currentRequest.created_at ? new Date(currentRequest.created_at).toLocaleString() : 'Pending submission'}</span>
                  </div>
                </div>

                <div className="p-md bg-surface-container border-l-4 border-primary rounded-r-lg mb-lg">
                  <h4 className="font-label-md font-bold text-primary uppercase tracking-wider mb-sm">Issue Description</h4>
                  <p className="text-body-md text-on-surface leading-relaxed">{currentRequest.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
                  {[
                    { icon: 'payments', label: 'Estimated Cost', value: `$${Number(currentRequest.cost || 4250).toLocaleString()}.00` },
                    { icon: 'schedule', label: 'Repair Time', value: '6.5 Hours' },
                    { icon: 'engineering', label: 'Expert Required', value: 'Grade 4 Tech' },
                  ].map((item, i) => (
                    <div key={i} className="p-md rounded-lg border border-outline-variant/30 bg-surface">
                      <span className="material-symbols-outlined text-secondary mb-xs">{item.icon}</span>
                      <h5 className="text-label-sm text-outline uppercase font-bold">{item.label}</h5>
                      <p className="text-headline-md font-bold text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance History */}
              <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant/30">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="font-headline-md text-headline-md text-primary">Asset Maintenance History</h3>
                  <button className="text-label-md text-secondary font-bold hover:underline">View Full Logs</button>
                </div>
                <div className="space-y-lg relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
                  {[
                    { dot: 'bg-secondary', title: 'Scheduled Calibration', desc: 'Routine 6-month preventive maintenance successfully completed.', date: 'Aug 12, 2023' },
                    { dot: 'bg-error', title: 'Cooling Pump Failure', desc: 'Emergency replacement of secondary cooling pump. Total downtime: 14h.', badge: 'Cost: $1,240', date: 'May 20, 2023' },
                    { dot: 'bg-secondary', title: 'Firmware Update v2.4', desc: 'Standard system optimization for precision alignment.', date: 'Mar 05, 2023' },
                  ].map((item, i) => (
                    <div key={i} className="relative pl-xl">
                      <div className="absolute left-0 top-1 w-[24px] h-[24px] rounded-full bg-surface-container-highest border-2 border-outline-variant flex items-center justify-center z-10">
                        <div className={`w-2 h-2 rounded-full ${item.dot}`}></div>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-label-md font-bold text-primary">{item.title}</h4>
                          <p className="text-body-md text-on-surface-variant">{item.desc}</p>
                          {item.badge && <span className="text-label-sm font-semibold text-secondary-fixed-dim bg-secondary/10 px-xs py-base rounded mt-xs inline-block">{item.badge}</span>}
                        </div>
                        <span className="text-label-sm text-outline whitespace-nowrap ml-md">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 space-y-lg">
              <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant/30 sticky top-[100px]">
                <h3 className="font-headline-md text-headline-md text-primary mb-md">Manager Action</h3>

                {approved !== null && (
                  <div className={`p-md rounded-lg mb-md flex items-center gap-sm ${approved ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-on-error-container'}`}>
                    <span className="material-symbols-outlined">{approved ? 'check_circle' : 'cancel'}</span>
                    <span className="font-label-md font-bold">{approved ? 'Request Approved!' : 'Request Rejected'}</span>
                  </div>
                )}

                <div className="space-y-md mb-lg">
                  <label className="block">
                    <span className="text-label-md text-on-surface-variant font-semibold mb-xs block">Approval Comments</span>
                    <textarea
                      className="w-full bg-surface border border-outline-variant rounded-lg p-md text-body-md focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none transition-all placeholder:text-outline/50"
                      placeholder="Enter reason for approval or rejection..."
                      rows="5"
                      value={comment}
                      onChange={e => setComment(e.target.value)}
                      style={{ borderColor: comment.length > 5 ? '#4a663e' : '' }}
                    ></textarea>
                  </label>
                  <div className="flex items-start gap-md p-md bg-secondary/5 rounded-lg border border-secondary/10">
                    <input className="w-4 h-4 rounded border-outline-variant text-secondary focus:ring-secondary/50 mt-xs" type="checkbox" />
                    <p className="text-label-sm text-on-secondary-fixed-variant leading-tight">
                      Flag for immediate budget review (Required for expenditures over $2,500)
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-md">
                  <button onClick={() => handleDecision(true)} disabled={isUpdating} className="w-full py-md bg-secondary text-white rounded-lg font-bold flex items-center justify-center gap-sm hover:brightness-110 active:opacity-80 transition-all shadow-sm disabled:opacity-70">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    {isUpdating ? 'Updating…' : 'Approve Maintenance'}
                  </button>
                  <button onClick={() => handleDecision(false)} disabled={isUpdating} className="w-full py-md bg-white border-2 border-error text-error rounded-lg font-bold flex items-center justify-center gap-sm hover:bg-error/5 active:opacity-80 transition-all disabled:opacity-70">
                    <span className="material-symbols-outlined">cancel</span>
                    Reject Request
                  </button>
                  <button className="w-full py-sm text-outline hover:text-primary font-bold text-label-md transition-colors flex items-center justify-center gap-sm">
                    <span className="material-symbols-outlined">info</span>
                    Request More Information
                  </button>
                </div>

                <div className="mt-lg pt-lg border-t border-outline-variant/30">
                  <div className="flex items-center justify-between mb-sm">
                    <span className="text-label-sm text-outline uppercase font-bold">Budget Status</span>
                    <span className="text-label-sm text-secondary font-bold">Within Quarterly Limit</span>
                  </div>
                  <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[65%] rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-outline mt-xs text-right">Remaining: $12,450 / $40,000</p>
                </div>
              </div>

              {/* Asset Details */}
              <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant/30 overflow-hidden relative">
                <h4 className="font-label-md font-bold text-primary uppercase tracking-wider mb-md">Asset Details</h4>
                <div className="space-y-sm">
                  {[
                    { label: 'Serial Number', value: 'LC-2023-X12-004', mono: true },
                    { label: 'Purchase Date', value: 'Jan 15, 2023' },
                    { label: 'Warranty Status', value: 'Active (Exp. 2025)', color: 'text-secondary' },
                    { label: 'Last Inspection', value: '14 days ago' },
                  ].map((row, i) => (
                    <div key={i} className="flex justify-between py-xs border-b border-outline-variant/20">
                      <span className="text-label-md text-outline">{row.label}</span>
                      <span className={`text-label-md font-semibold ${row.mono ? 'font-mono' : ''} ${row.color || ''}`}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-lg rounded-lg overflow-hidden h-32 relative">
                  <img className="w-full h-full object-cover grayscale brightness-75" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDumovWoSlQS1-bt1DFxCe5CA88ZLSp2DRSMNh0KmFSZzfwSD6vn5dvV6qFV5d5hi66hc2bls9nBKAhXq1IMVdugqQSkbzRAEwMXdZt7q9wVRi30nYSGOOQLEXaUYeaFtSqvqVpK331Q1wQ1RKcGTGSvDmkRdT2ifUBoYQhicIK5tq8NoKvqXbL53NS0hWgFVNHSVFGtsS5d-G1lBjikGIlcxuMVLNbiJsu7b742R28C-oQ7pYNRshabg" alt="Machine" />
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/20 backdrop-blur-[1px]">
                    <button className="bg-white/90 px-md py-sm rounded-full text-label-sm font-bold flex items-center gap-xs text-primary shadow-xl">
                      <span className="material-symbols-outlined text-[18px]">photo_library</span>
                      View Unit Photos
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="h-xl"></div>
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-outline-variant z-50 flex justify-around items-center h-16 px-md">
        {[{ icon: 'dashboard', label: 'Home' }, { icon: 'build', label: 'Maint.', active: true }, { icon: 'category', label: 'Assets' }, { icon: 'person', label: 'Profile' }].map((item, i) => (
          <button key={i} className={`flex flex-col items-center gap-xs ${item.active ? 'text-primary' : 'text-outline hover:text-primary transition-colors'}`}>
            <span className="material-symbols-outlined" style={item.active ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
            <span className="text-[10px] font-bold uppercase">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
