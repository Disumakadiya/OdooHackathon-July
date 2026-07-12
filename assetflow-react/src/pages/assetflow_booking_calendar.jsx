import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { getBookings } from '../services/bookingService';
import { getNotifications } from '../services/notificationService';

export default function assetflow_booking_calendar() {
  const [toastVisible, setToastVisible] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    document.title = 'AssetFlow | Resource Booking Calendar';
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const [bookingData, notificationData] = await Promise.all([getBookings(), getNotifications()]);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
      setNotifications(Array.isArray(notificationData) ? notificationData : []);
    } catch (error) {
      setErrorMessage(error?.response?.data?.message || error?.message || 'Unable to load reservation data right now.');
    } finally {
      setLoading(false);
    }
  };

  const handleFabClick = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  const upcomingBooking = bookings[0];
  const pendingNotifications = notifications.slice(0, 2);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden">
      <nav className="sticky top-0 z-40 flex justify-between items-center w-full px-lg py-sm bg-surface border-b border-outline-variant max-w-full">
        <div className="flex items-center gap-md">
          <span className="text-headline-md font-headline-md font-bold text-primary">AssetFlow</span>
          <div className="hidden md:flex items-center ml-lg gap-md">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="pl-10 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-label-md focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-primary transition-all w-64" placeholder="Search resources..." type="text" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-md">
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-primary">notifications</span></button>
          <button className="p-2 rounded-full hover:bg-surface-container-low transition-colors"><span className="material-symbols-outlined text-primary">help</span></button>
          <div className="w-8 h-8 rounded-full bg-surface-container-highest overflow-hidden cursor-pointer border border-outline-variant">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDJ_wYUP-B99hzWJgrrVj1wr1DWo1ng1FimoXw8mNRuymH5KALJ-fymFR7KwKqk2bvQOtl19Np-615SLkskP7UzkPHUxYPoyoZ6pv_4F8n_6okfFH9AMDnKIODePFFDE4fWgXblKp_xR1acxJUk0YZjF1cwJBHdtF967_ku3dWjjYnDpoXIcyF0EkJnyXwoe3DNnOwP7PXLF_HdbA99CsBvwocYW00Vpbf1JhWh53tdv2Yna9ez92Zpmg" alt="User" />
          </div>
        </div>
      </nav>

      <div className="flex">
        <Sidebar />

        <main className="flex-1 md:ml-64 p-lg max-w-max-width mx-auto">
          <header className="mb-xl flex flex-col md:flex-row md:items-end justify-between gap-md">
            <div>
              <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight mb-sm">Resource Booking</h1>
              <p className="text-on-surface-variant font-body-md max-w-2xl">Manage availability and schedule high-value enterprise assets including conference rooms, fleet vehicles, and specialized technical equipment.</p>
            </div>
            <div className="flex items-center gap-sm">
              <button className="px-md py-2 border border-outline-variant text-primary rounded-lg font-label-md flex items-center gap-sm hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-[20px]">filter_list</span> Filters
              </button>
              <div className="flex bg-surface-container-highest p-1 rounded-lg">
                <button className="px-md py-1 bg-white shadow-sm rounded-md font-label-md text-primary">Week</button>
                <button className="px-md py-1 text-on-surface-variant font-label-md">Month</button>
              </div>
            </div>
          </header>

          {(loading || errorMessage) && (
            <div className={`mb-lg rounded-lg border px-md py-sm text-label-sm ${errorMessage ? 'border-error/20 bg-error/5 text-error' : 'border-primary/20 bg-primary/5 text-primary'}`}>
              {loading ? 'Loading resource bookings from the backend…' : errorMessage}
            </div>
          )}

          <div className="grid grid-cols-12 gap-lg">
            <div className="col-span-12 lg:col-span-3 space-y-lg">
              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
                <h3 className="font-headline-md text-label-md text-primary mb-md">Select Resources</h3>
                <div className="space-y-md">
                  {[{ label: 'Conference Rooms', color: 'bg-primary' }, { label: 'Fleet Vehicles', color: 'bg-secondary' }, { label: 'AV Equipment', color: 'bg-tertiary-container' }].map((res, i) => (
                    <label key={i} className="flex items-center gap-md cursor-pointer group">
                      <div className="w-5 h-5 border-2 border-outline rounded flex items-center justify-center group-hover:border-primary transition-colors">
                        <div className={`w-3 h-3 ${res.color} rounded-sm`}></div>
                      </div>
                      <span className="text-label-md text-on-surface-variant">{res.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
                <h3 className="font-headline-md text-label-md text-primary mb-md">Quick Stats</h3>
                <div className="space-y-sm">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-label-sm text-on-surface-variant">Room Utilization</span>
                    <span className="font-label-md text-primary">82%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full">
                    <div className="bg-primary h-full rounded-full w-[82%]"></div>
                  </div>
                  <div className="flex justify-between items-center py-2 pt-md">
                    <span className="text-label-sm text-on-surface-variant">Fleet Availability</span>
                    <span className="font-label-md text-secondary">4/12 Free</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-1.5 rounded-full">
                    <div className="bg-secondary h-full rounded-full w-[33%]"></div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30">
                <div className="flex justify-between items-center mb-md">
                  <span className="font-label-md text-primary">October 2024</span>
                  <div className="flex gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">chevron_left</span>
                    <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary">chevron_right</span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 text-center">
                  {['M','T','W','T','F','S','S'].map((d, i) => <span key={i} className="text-[10px] text-on-surface-variant font-bold">{d}</span>)}
                  {['28','29','30'].map(d => <span key={d} className="text-label-sm text-outline p-1">{d}</span>)}
                  {['1','2','3','4','5','6','7'].map(d => <span key={d} className="text-label-sm text-on-surface p-1">{d}</span>)}
                  <span className="text-label-sm bg-primary text-white rounded-full p-1 w-6 h-6 mx-auto flex items-center justify-center">8</span>
                  {['9','10','11'].map(d => <span key={d} className="text-label-sm text-on-surface p-1">{d}</span>)}
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-9 bg-white rounded-xl custom-shadow border border-outline-variant/30 overflow-hidden flex flex-col">
              <div className="p-lg border-b border-outline-variant/30 flex items-center justify-between">
                <div className="flex items-center gap-md">
                  <h2 className="font-headline-md text-primary">Weekly Schedule</h2>
                  <span className="text-on-surface-variant font-body-md">Live booking overview</span>
                </div>
                <div className="flex items-center gap-sm">
                  <button className="p-2 hover:bg-surface-container rounded-full transition-all"><span className="material-symbols-outlined">print</span></button>
                  <button className="p-2 hover:bg-surface-container rounded-full transition-all"><span className="material-symbols-outlined">share</span></button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className="grid grid-cols-8 border-b border-outline-variant/30">
                    <div className="p-md text-label-sm text-outline border-r border-outline-variant/30 bg-surface-container-low">Time</div>
                    {[{d:'Mon',n:'7'},{d:'Tue',n:'8',active:true},{d:'Wed',n:'9'},{d:'Thu',n:'10'},{d:'Fri',n:'11'},{d:'Sat',n:'12'},{d:'Sun',n:'13'}].map((day, i) => (
                      <div key={i} className={`p-md text-center border-r border-outline-variant/30 ${day.active ? 'bg-surface-container/30' : ''}`}>
                        <p className={`text-label-sm ${day.active ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>{day.d}</p>
                        <p className={`text-headline-md ${day.active ? 'text-primary' : 'text-on-surface'}`}>{day.n}</p>
                      </div>
                    ))}
                  </div>
                  <div className="relative h-[600px] overflow-y-auto no-scrollbar">
                    <div className="absolute inset-0 grid grid-cols-8 grid-rows-[repeat(12,minmax(80px,1fr))] pointer-events-none">
                      {['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00'].map((time) => (
                        <div key={time} className="contents">
                          <div className="border-r border-outline-variant/30 border-b border-outline-variant/10 flex items-start justify-end pr-md pt-base text-label-sm text-outline">{time}</div>
                          {[0,1,2,3,4,5,6].map((j) => <div key={`${time}-${j}`} className={`border-r border-outline-variant/30 border-b border-outline-variant/10 ${j === 6 ? 'border-r-0' : ''}`}></div>)}
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 p-2">
                      {bookings.slice(0, 3).map((booking, index) => (
                        <div key={booking.id || index} className={`mb-sm rounded-r-lg p-2 ${index % 2 === 0 ? 'bg-primary/10 border-l-4 border-primary' : 'bg-secondary/10 border-l-4 border-secondary'}`}>
                          <p className={`text-label-sm font-bold ${index % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>{booking.purpose || 'Reserved Asset'}</p>
                          <p className={`text-[10px] ${index % 2 === 0 ? 'text-primary/70' : 'text-secondary/70'}`}>{new Date(booking.start_time).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg pb-xl">
            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 flex flex-col justify-between">
              <div>
                <h3 className="font-headline-md text-label-md text-primary mb-md">Upcoming Today</h3>
                <div className="flex items-center gap-md p-md bg-surface-container-low rounded-lg mb-md">
                  <span className="material-symbols-outlined text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>directions_car</span>
                  <div>
                    <p className="text-label-md font-bold text-on-surface">{upcomingBooking ? (upcomingBooking.purpose || 'Reserved asset') : 'No upcoming bookings'}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {upcomingBooking ? `${new Date(upcomingBooking.start_time).toLocaleString()} • Asset ${upcomingBooking.asset_id}` : 'Your next reservation will appear here.'}
                    </p>
                  </div>
                </div>
              </div>
              <button className="w-full py-2 text-label-md text-primary border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">View All Schedule</button>
            </div>

            <div className="bg-secondary p-lg rounded-xl custom-shadow text-white relative overflow-hidden">
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-label-md mb-md">Efficiency Insight</h3>
                  <p className="font-body-md opacity-90 leading-relaxed">Conference Room B has seen a 14% increase in utilization this month. Consider adding more shared workstations.</p>
                </div>
                <div className="flex items-center gap-sm mt-md">
                  <span className="material-symbols-outlined">trending_up</span>
                  <span className="text-label-md font-bold">+14% MoM</span>
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-10">
                <span className="material-symbols-outlined text-[120px]">analytics</span>
              </div>
            </div>

            <div className="bg-white p-lg rounded-xl custom-shadow border border-outline-variant/30 col-span-1 md:col-span-2 lg:col-span-1">
              <h3 className="font-headline-md text-label-md text-primary mb-md">Pending Requests</h3>
              <div className="space-y-md">
                {pendingNotifications.length > 0 ? pendingNotifications.map((req, i) => (
                  <div key={req.id || i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-md">
                      <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-outline">person</span>
                      </div>
                      <div>
                        <p className="text-label-md font-bold text-on-surface">{req.title || 'Notification'}</p>
                        <p className="text-label-sm text-on-surface-variant">{req.message || 'Backend update available.'}</p>
                      </div>
                    </div>
                  </div>
                )) : (
                  <div className="text-label-sm text-on-surface-variant">No pending requests right now.</div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>

      <button onClick={handleFabClick} className="fixed bottom-lg right-lg bg-primary text-white flex items-center gap-md px-lg py-md rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all z-50 group">
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">add</span>
        <span className="font-label-md font-bold">Create Booking</span>
      </button>

      <div className={`fixed bottom-lg left-1/2 -translate-x-1/2 bg-on-surface text-surface px-lg py-md rounded-xl shadow-2xl flex items-center gap-md z-[60] transition-all duration-300 ${toastVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}>
        <span className="material-symbols-outlined text-secondary">check_circle</span>
        <span className="font-label-md">New booking successfully created</span>
      </div>
    </div>
  );
}
