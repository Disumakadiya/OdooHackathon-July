import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { createBooking, getBookings } from '../services/bookingService';

export default function assetflow_create_booking() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [selectedResource, setSelectedResource] = useState('laptop');
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    startDate: '2024-10-14',
    startTime: '09:00',
    endTime: '17:00',
    purpose: 'Operational booking',
  });

  useEffect(() => {
    document.title = 'AssetFlow | Resource Booking';
    loadReservations();
  }, []);

  const loadReservations = async () => {
    setLoading(true);
    try {
      const bookingData = await getBookings();
      setReservations(Array.isArray(bookingData) ? bookingData : []);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || 'Unable to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  const submitBooking = async () => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const payload = {
        asset_id: 1,
        employee_id: 1,
        start_time: `${formData.startDate}T${formData.startTime}:00`,
        end_time: `${formData.startDate}T${formData.endTime}:00`,
        purpose: formData.purpose,
        status: 'pending',
      };

      await createBooking(payload);
      await loadReservations();

      setPanelOpen(false);
      document.body.style.overflow = '';
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || error?.message || 'Booking creation failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openPanel = () => { setPanelOpen(true); document.body.style.overflow = 'hidden'; };
  const closePanel = () => { setPanelOpen(false); document.body.style.overflow = ''; };

  return (
    <div className="bg-surface-container-low text-on-surface font-body-md text-body-md overflow-x-hidden">
      <Sidebar />

      <header className="sticky top-0 z-40 flex justify-between items-center w-full px-lg py-sm bg-surface border-b border-outline-variant md:ml-64 md:w-[calc(100%-16rem)]">
        <div className="flex items-center gap-md">
          <button className="md:hidden p-sm text-on-surface-variant"><span className="material-symbols-outlined">menu</span></button>
          <h2 className="font-headline-md text-headline-md font-bold text-primary">Resource Booking</h2>
        </div>
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-low p-sm rounded-full transition-colors">notifications</span>
          <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-low p-sm rounded-full transition-colors">help</span>
        </div>
      </header>

      <main className="md:ml-64 p-lg min-h-[calc(100vh-64px)] max-w-max-width mx-auto">
        {/* Booking Overview */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-xl">
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-lg soft-shadow flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <span className="font-label-sm text-secondary uppercase tracking-widest bg-secondary-container px-sm py-xs rounded">Available Now</span>
              <h3 className="font-display text-headline-lg mt-md mb-sm text-primary">Reserve workspace, equipment, or meeting rooms in seconds.</h3>
              <p className="text-on-surface-variant max-w-xl">AssetFlow streamlines your operational needs. Select your resource, define your window, and coordinate with your team.</p>
            </div>
            <div className="mt-xl flex gap-md relative z-10">
              <button onClick={openPanel} className="bg-primary text-on-primary px-lg py-md rounded-lg font-label-md flex items-center gap-sm active:opacity-80 transition-opacity">
                <span className="material-symbols-outlined">add</span> New Booking
              </button>
              <button className="bg-surface-container-high text-on-surface-variant px-lg py-md rounded-lg font-label-md transition-all hover:bg-surface-container-highest">
                View Schedule
              </button>
            </div>
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
              <span className="material-symbols-outlined text-[240px]">calendar_today</span>
            </div>
          </div>

          <div className="md:col-span-4 grid grid-rows-2 gap-lg">
            <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant flex items-center gap-lg">
              <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant">Active Bookings</p>
                <p className="font-headline-md text-primary">{reservations.length > 0 ? `${reservations.length} Bookings` : 'Live Data'}</p>
              </div>
            </div>
            <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow border border-outline-variant flex items-center gap-lg">
              <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined">timer</span>
              </div>
              <div>
                <p className="font-label-sm text-on-surface-variant">Next Reservation</p>
                <p className="font-headline-md text-primary">{loading ? 'Loading...' : (reservations[0] ? 'Connected' : 'Ready')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Reservations */}
        <div className="bg-surface-container-lowest rounded-xl p-lg soft-shadow">
          <div className="flex justify-between items-center mb-lg">
            <h4 className="font-headline-md text-primary">Current Reservations</h4>
            <div className="flex gap-sm">
              <span className="material-symbols-outlined p-sm bg-surface rounded-lg border border-outline-variant cursor-pointer text-on-surface-variant">filter_list</span>
              <span className="material-symbols-outlined p-sm bg-surface rounded-lg border border-outline-variant cursor-pointer text-on-surface-variant">search</span>
            </div>
          </div>
          {submitError && <div className="mb-md rounded-lg border border-error/20 bg-error/5 px-md py-sm text-label-sm text-error">{submitError}</div>}
          <div className="space-y-sm">
            {reservations.length > 0 ? reservations.slice(0, 3).map((item, i) => (
              <div key={item.id || i} className="flex items-center justify-between p-md hover:bg-surface-container-low rounded-lg transition-colors group cursor-pointer border-b border-outline-variant/30">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">{i === 0 ? 'meeting_room' : i === 1 ? 'laptop_mac' : 'camera_alt'}</span>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">{item.purpose || 'Reserved Asset'}</p>
                    <p className="font-label-sm text-on-surface-variant">{new Date(item.start_time).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-xl">
                  <span className={`font-label-sm ${item.status === 'Confirmed' ? 'text-secondary bg-secondary-container/30' : 'text-tertiary bg-tertiary-container/30'} px-sm py-1 rounded-full`}>{item.status || 'Pending'}</span>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant">more_vert</span>
                </div>
              </div>
            )) : [
              { icon: 'meeting_room', name: 'Conference Room Alpha', detail: 'Today • 2:00 PM - 4:00 PM', status: 'Confirmed', statusColor: 'text-secondary bg-secondary-container/30' },
              { icon: 'laptop_mac', name: 'MacBook Pro M3 Max #04', detail: 'Oct 14 - Oct 16 • All day', status: 'Pending', statusColor: 'text-tertiary bg-tertiary-container/30' },
              { icon: 'camera_alt', name: 'Sony A7R V Camera Kit', detail: 'Oct 15 • 10:00 AM - 1:00 PM', status: 'Confirmed', statusColor: 'text-secondary bg-secondary-container/30' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-md hover:bg-surface-container-low rounded-lg transition-colors group cursor-pointer border-b border-outline-variant/30">
                <div className="flex items-center gap-md">
                  <div className="w-10 h-10 bg-surface-container-highest rounded-lg flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface">{item.name}</p>
                    <p className="font-label-sm text-on-surface-variant">{item.detail}</p>
                  </div>
                </div>
                <div className="flex items-center gap-xl">
                  <span className={`font-label-sm ${item.statusColor} px-sm py-1 rounded-full`}>{item.status}</span>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity text-on-surface-variant">more_vert</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-lg pt-md text-center">
            <button className="text-primary font-label-md hover:underline decoration-secondary underline-offset-4">View Full History</button>
          </div>
        </div>
      </main>

      {/* Overlay */}
      {panelOpen && (
        <div className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm z-[60] transition-opacity duration-300" onClick={closePanel}></div>
      )}

      {/* Booking Panel */}
      <div className={`fixed top-0 right-0 h-screen w-full md:w-[480px] bg-background shadow-2xl z-[70] flex flex-col transition-transform duration-500 ease-in-out ${panelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface">
          <div>
            <h3 className="font-headline-md text-headline-md text-primary">New Reservation</h3>
            <p className="font-label-sm text-on-surface-variant">Fill in the details to reserve a resource.</p>
          </div>
          <button onClick={closePanel} className="p-sm hover:bg-surface-container rounded-full text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-lg custom-scrollbar space-y-xl">
          {/* Resource Selection */}
          <section className="space-y-md">
            <div className="flex items-center gap-sm mb-base">
              <span className="material-symbols-outlined text-secondary">inventory</span>
              <label className="font-label-md text-on-surface">Select Resource</label>
            </div>
            <div className="grid grid-cols-2 gap-sm">
              {[
                { id: 'room', icon: 'meeting_room', label: 'Room', sub: 'Shared spaces' },
                { id: 'laptop', icon: 'laptop_mac', label: 'Device', sub: 'Tech & Hardware' },
                { id: 'vehicle', icon: 'commute', label: 'Vehicle', sub: 'Fleet management' },
                { id: 'other', icon: 'more_horiz', label: 'Other', sub: 'Misc items' },
              ].map(res => (
                <button
                  key={res.id}
                  onClick={() => setSelectedResource(res.id)}
                  className={`group border p-md rounded-xl text-left transition-all active:scale-[0.98] ${selectedResource === res.id ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary hover:bg-surface'}`}
                >
                  <span className={`material-symbols-outlined mb-sm ${selectedResource === res.id ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>{res.icon}</span>
                  <p className="font-label-md text-on-surface">{res.label}</p>
                  <p className="text-xs text-on-surface-variant">{res.sub}</p>
                </button>
              ))}
            </div>
            <div className="relative mt-md">
              <select className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md text-on-surface focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-primary appearance-none transition-all">
                <option>MacBook Pro M3 Max #04</option>
                <option>iPad Pro 12.9" #02</option>
                <option>Sony A7R V Camera</option>
                <option>DJI Ronin Stabilizer</option>
              </select>
              <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </section>

          {/* Timeline */}
          <section className="space-y-md">
            <div className="flex items-center gap-sm mb-base">
              <span className="material-symbols-outlined text-secondary">schedule</span>
              <label className="font-label-md text-on-surface">Timeline</label>
            </div>
            <div className="bg-surface-container rounded-xl p-md space-y-md">
              <div>
                <p className="text-xs text-on-surface-variant mb-xs ml-1 uppercase font-bold tracking-tighter">Start Date</p>
                <input
                  className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-secondary/20 focus:border-primary outline-none transition-all"
                  type="date"
                  value={formData.startDate}
                  onChange={(event) => setFormData((prev) => ({ ...prev, startDate: event.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-md">
                <div>
                  <p className="text-xs text-on-surface-variant mb-xs ml-1 uppercase font-bold tracking-tighter">Start Time</p>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-secondary/20 focus:border-primary outline-none transition-all"
                    type="time"
                    value={formData.startTime}
                    onChange={(event) => setFormData((prev) => ({ ...prev, startTime: event.target.value }))}
                  />
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant mb-xs ml-1 uppercase font-bold tracking-tighter">End Time</p>
                  <input
                    className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-secondary/20 focus:border-primary outline-none transition-all"
                    type="time"
                    value={formData.endTime}
                    onChange={(event) => setFormData((prev) => ({ ...prev, endTime: event.target.value }))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-sm pt-sm border-t border-outline-variant/30">
                <input className="w-4 h-4 text-primary bg-surface border-outline rounded focus:ring-secondary/40 focus:ring-2" id="all-day" type="checkbox" />
                <label className="font-label-md text-on-surface-variant cursor-pointer select-none" htmlFor="all-day">All day reservation</label>
              </div>
            </div>
          </section>

          {/* Purpose */}
          <section className="space-y-md">
            <div className="flex items-center gap-sm mb-base">
              <span className="material-symbols-outlined text-secondary">description</span>
              <label className="font-label-md text-on-surface">Purpose & Notes</label>
            </div>
            <textarea
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-secondary/20 focus:border-primary outline-none transition-all resize-none placeholder:text-on-surface-variant/50"
              placeholder="Briefly describe what you'll be using this for..."
              rows="4"
              value={formData.purpose}
              onChange={(event) => setFormData((prev) => ({ ...prev, purpose: event.target.value }))}
            ></textarea>
            <div className="flex items-center justify-between p-sm bg-surface-container-low rounded-lg border border-outline-variant/40">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-on-surface-variant">attach_file</span>
                <span className="font-label-sm text-on-surface-variant">Attach project brief</span>
              </div>
              <button className="text-xs font-bold text-primary hover:underline">Upload</button>
            </div>
          </section>
        </div>

        <div className="p-lg border-t border-outline-variant bg-surface flex gap-md">
          <button onClick={closePanel} className="flex-1 py-md border border-outline-variant text-on-surface-variant rounded-lg font-label-md hover:bg-surface-container transition-all">
            Cancel
          </button>
          <button onClick={submitBooking} disabled={isSubmitting} className="flex-[2] py-md bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-sm shadow-lg disabled:opacity-70">
            {isSubmitting ? 'Submitting…' : 'Confirm Reservation'} <span className="material-symbols-outlined text-lg">check_circle</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      <div className={`fixed bottom-lg left-1/2 -translate-x-1/2 z-[100] bg-secondary text-on-secondary px-xl py-md rounded-full font-label-md flex items-center gap-sm shadow-2xl transition-all duration-500 ${toastVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <span className="material-symbols-outlined">check</span>
        Reservation confirmed successfully!
      </div>
    </div>
  );
}
