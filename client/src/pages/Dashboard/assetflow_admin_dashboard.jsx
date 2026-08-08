import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/Card";
import NotificationCard from "../../components/NotificationCard";
import SearchBar from "../../components/SearchBar";
import Sidebar from "../../components/Sidebar";
import {
  fetchDashboardKpis,
  fetchRecentActivities,
  fetchAssetUtilization,
  fetchDepartmentWiseAssets,
  fetchMaintenanceCost,
  fetchBookingStatistics,
  fetchAuditCompletion,
  fetchNotifications,
  fetchQuickActions,
} from "../../services/dashboardService";

export default function assetflow_admin_dashboard() {
  const location = useLocation();
  const reportRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const { user } = useAuth();
  const [kpis, setKpis] = useState([]);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [utilization, setUtilization] = useState([]);
  const [departmentAssets, setDepartmentAssets] = useState([]);
  const [maintenanceCost, setMaintenanceCost] = useState([]);
  const [bookingStats, setBookingStats] = useState([]);
  const [auditCompletion, setAuditCompletion] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = location.pathname === "/reports" ? "AssetFlow | Reports" : "AssetFlow | Dashboard";
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/reports" && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;
    async function loadDashboard() {
      try {
        const [k, a, u, d, m, b, ac, n, q] = await Promise.all([
          fetchDashboardKpis(),
          fetchRecentActivities(),
          fetchAssetUtilization(),
          fetchDepartmentWiseAssets(),
          fetchMaintenanceCost(),
          fetchBookingStatistics(),
          fetchAuditCompletion(),
          fetchNotifications(),
          fetchQuickActions(),
        ]);
        if (!cancelled) {
          setKpis(k);
          setActivities(a);
          setUtilization(u);
          setDepartmentAssets(d);
          setMaintenanceCost(m);
          setBookingStats(b);
          setAuditCompletion(ac);
          setNotifications(n);
          setQuickActions(q);
        }
      } catch (err) {
        if (!cancelled) console.error("Failed to load dashboard data:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  const filteredActivities = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();
    if (!keyword) return activities;
    return activities.filter((item) =>
      `${item.title} ${item.description}`.toLowerCase().includes(keyword)
    );
  }, [activities, searchText]);

  const maxDepartmentAssets = Math.max(...(departmentAssets.map((item) => item.count)), 1);
  const maxMaintenanceCost = Math.max(...(maintenanceCost.map((item) => item.cost)), 1);

  return (
    <div className="font-body-md text-body-md overflow-x-hidden">
      <Sidebar />

      <main className="min-h-screen md:ml-64">
        <header className="sticky top-0 z-40 flex items-center justify-between gap-md border-b border-outline-variant bg-surface px-lg py-sm">
          <div className="w-full max-w-xl">
            <SearchBar
              placeholder="Search recent activities..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
            />
          </div>
          <div className="hidden items-center space-x-md sm:flex">
            <button className="material-symbols-outlined rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low">
              notifications
            </button>
            <button className="material-symbols-outlined rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-low">
              help
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-max-width space-y-xl p-lg pb-2xl">
          <section>
            <h2 className="font-headline-lg text-headline-lg text-primary">
              Welcome back, {user?.name || 'Admin'}
            </h2>
            <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
              Enterprise asset and resource snapshot with live operational indicators.
            </p>
          </section>

          <section className="grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="border-white">
                    <div className="mb-md flex items-center justify-between">
                      <div className="h-10 w-10 animate-pulse rounded-lg bg-surface-container-highest" />
                      <div className="h-6 w-16 animate-pulse rounded-full bg-surface-container-highest" />
                    </div>
                    <div className="mt-2 h-4 w-24 animate-pulse rounded bg-surface-container-highest" />
                    <div className="mt-2 h-8 w-20 animate-pulse rounded bg-surface-container-highest" />
                  </Card>
                ))
              : kpis.map((kpi) => (
                  <Card key={kpi.id} className="border-white transition-transform hover:-translate-y-[2px]">
                    <div className="mb-md flex items-center justify-between">
                      <span className="material-symbols-outlined rounded-lg bg-surface-container p-sm text-primary">
                        {kpi.icon}
                      </span>
                      <span
                        className={`rounded-full px-sm py-1 font-label-sm text-label-sm ${
                          kpi.trendType === "positive"
                            ? "bg-secondary/10 text-secondary"
                            : kpi.trendType === "warning"
                            ? "bg-tertiary-container/20 text-tertiary"
                            : "bg-surface-container text-on-surface-variant"
                        }`}
                      >
                        {kpi.trend}
                      </span>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface-variant">{kpi.label}</p>
                    <p className="mt-xs font-headline-lg text-headline-lg text-primary">{kpi.value.toLocaleString()}</p>
                  </Card>
                ))}
          </section>

          <section className="grid grid-cols-1 gap-lg xl:grid-cols-12">
            <Card className="xl:col-span-7" title="Recent Activities">
              <div className="space-y-md">
                {filteredActivities.length > 0
                  ? filteredActivities.map((item) => (
                      <article
                        key={item.id}
                        className="flex items-start justify-between gap-md rounded-lg border border-outline-variant p-md"
                      >
                        <div>
                          <h4 className="font-label-md text-label-md text-on-surface">{item.title}</h4>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">{item.description}</p>
                        </div>
                        <p className="whitespace-nowrap font-label-sm text-label-sm text-on-surface-variant">{item.time}</p>
                      </article>
                    ))
                  : !loading && (
                      <p className="font-label-md text-label-md text-on-surface-variant">No matching activities found.</p>
                    )}
              </div>
            </Card>

            <Card className="xl:col-span-5" title="Quick Actions">
              <div className="grid grid-cols-1 gap-sm sm:grid-cols-2 xl:grid-cols-1">
                {quickActions.map((action) => (
                  <Link
                    key={action.id}
                    to={action.route}
                    className="flex items-center gap-sm rounded-lg border border-outline-variant bg-surface-container px-md py-sm font-label-md text-label-md text-primary transition-colors hover:bg-surface-container-high"
                  >
                    <span className="material-symbols-outlined text-[20px]">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </Card>
          </section>

          <section ref={reportRef} className="space-y-lg">
            <div>
              <h3 className="font-headline-md text-headline-md text-primary">Reports & Analytics</h3>
              <p className="font-label-md text-label-md text-on-surface-variant">
                Asset utilization, department distribution, maintenance trend, booking activity, and audit completion.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-lg xl:grid-cols-12">
              <Card className="xl:col-span-4" title="Asset Utilization">
                <div className="space-y-sm">
                  {utilization.map((item) => (
                    <div key={item.id}>
                      <div className="mb-xs flex items-center justify-between font-label-md text-label-md">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-surface-container-highest">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="xl:col-span-4" title="Department Wise Assets">
                <div className="space-y-sm">
                  {departmentAssets.map((item) => (
                    <div key={item.id} className="flex items-center gap-sm">
                      <span className="w-24 font-label-sm text-label-sm text-on-surface-variant">{item.department}</span>
                      <div className="h-2 flex-1 rounded-full bg-surface-container-highest">
                        <div
                          className="h-full rounded-full bg-secondary"
                          style={{ width: `${Math.round((item.count / maxDepartmentAssets) * 100)}%` }}
                        />
                      </div>
                      <span className="w-12 text-right font-label-sm text-label-sm">{item.count}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="xl:col-span-4" title="Booking Statistics">
                <div className="grid grid-cols-3 gap-sm">
                  {bookingStats.map((item) => (
                    <div key={item.id} className="rounded-lg border border-outline-variant bg-surface p-sm text-center">
                      <p className="font-label-sm text-label-sm text-on-surface-variant">{item.label}</p>
                      <p className="font-headline-md text-headline-md text-primary">{item.value}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="xl:col-span-8" title="Maintenance Cost (Monthly)">
                <div className="flex h-48 items-end gap-sm">
                  {maintenanceCost.map((item) => (
                    <div key={item.id} className="flex flex-1 flex-col items-center gap-xs">
                      <div
                        className="w-full rounded-t-md bg-tertiary-container/60"
                        style={{ height: `${Math.round((item.cost / maxMaintenanceCost) * 100)}%` }}
                        title={`$${item.cost}`}
                      />
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{item.month}</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="xl:col-span-4" title="Audit Completion">
                <div className="space-y-sm">
                  {auditCompletion.map((item) => (
                    <div key={item.id} className="flex items-center justify-between rounded-lg bg-surface-container p-sm">
                      <span className="font-label-md text-label-md text-on-surface">{item.label}</span>
                      <span className="font-label-md text-label-md text-primary">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </section>

          <section>
            <Card title="Recent Notifications" subtitle="Dashboard notification panel">
              <div className="grid grid-cols-1 gap-md lg:grid-cols-2">
                {notifications.map((item) => (
                  <NotificationCard
                    key={item.id}
                    title={item.title}
                    message={item.message}
                    time={item.time}
                    type={item.type || "info"}
                  />
                ))}
              </div>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}
