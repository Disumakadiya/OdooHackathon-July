import { Link, useLocation } from "react-router-dom";
import {
  BarChart3,
  CalendarDays,
  ClipboardCheck,
  FileWarning,
  Gauge,
  Hammer,
  LayoutList,
  LogOut,
  Menu,
  PackageCheck,
  PlusCircle,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: Gauge, path: "/dashboard" },
  { label: "Audit", icon: ShieldCheck, path: "/audit" },
  { label: "Asset Verification", icon: PackageCheck, path: "/assets" },
  { label: "Reports", icon: BarChart3, path: "/assetflow_reports" },
  { label: "Booking", icon: CalendarDays, path: "/assetflow_booking_calendar" },
  { label: "Create Booking", icon: PlusCircle, path: "/assetflow_create_booking" },
  { label: "Maintenance", icon: Hammer, path: "/assetflow_maintenance_requests" },
  { label: "Maintenance Approval", icon: ClipboardCheck, path: "/assetflow_maintenance_approval" },
  { label: "Discrepancy Report", icon: FileWarning, path: "/assetflow_discrepancy_report" },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const syncIsMobile = () => {
      const mobile = mediaQuery.matches;
      setIsMobile(mobile);
      if (!mobile) setMobileOpen(false);
    };

    syncIsMobile();
    mediaQuery.addEventListener("change", syncIsMobile);
    return () => mediaQuery.removeEventListener("change", syncIsMobile);
  }, []);

  const isActive = (path) =>
    location.pathname === path ||
    (path === "/dashboard" && location.pathname === "/") ||
    (path === "/assets" && location.pathname === "/assetflow_asset_verification");

  return (
    <>
      {/* Mobile floating toggle button */}
      {isMobile && !mobileOpen && (
        <button
          aria-label="Open navigation menu"
          className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-surface shadow-md border border-outline-variant text-on-surface-variant hover:text-primary transition-colors"
          onClick={() => setMobileOpen(true)}
          type="button"
        >
          <Menu size={20} strokeWidth={2.2} />
        </button>
      )}

      {/* Mobile backdrop */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`flex flex-col border-r border-outline-variant bg-surface/95 shadow-sm backdrop-blur-xl transition-[width,transform] duration-300 ease-out ${
          isMobile
            ? `fixed inset-y-0 left-0 z-40 w-64 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
            : `relative h-screen shrink-0 ${collapsed ? "w-20" : "w-64"}`
        }`}
      >
        <div className="flex h-16 items-center gap-3 border-b border-outline-variant px-4">
          <button
            aria-label={isMobile ? "Close navigation menu" : collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
            onClick={() => (isMobile ? setMobileOpen(false) : setCollapsed((current) => !current))}
            type="button"
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>

          <Link
            className={`flex min-w-0 items-center gap-3 overflow-hidden transition-opacity duration-200 ${
              isMobile ? "opacity-100" : collapsed ? "pointer-events-none opacity-0" : "opacity-100"
            }`}
            to="/dashboard"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <LayoutList size={20} strokeWidth={2.3} />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-headline-md text-headline-md font-bold text-primary">AssetFlow</span>
              <span className="block truncate font-label-sm text-label-sm text-on-surface-variant">Enterprise Assets</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isLinkActive = isActive(item.path);

              return (
                <Link
                  aria-label={isMobile || collapsed ? item.label : undefined}
                  className={`group flex h-11 items-center gap-3 rounded-lg px-3 font-label-md text-label-md transition-all duration-200 ${
                    isLinkActive
                      ? "bg-primary/10 text-primary shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  } ${collapsed && !isMobile ? "justify-center" : "justify-start"}`}
                  key={item.path}
                  title={collapsed && !isMobile ? item.label : undefined}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                >
                  <Icon className="shrink-0 transition-transform duration-200 group-hover:scale-105" size={20} strokeWidth={isLinkActive ? 2.5 : 2.1} />
                  <span className={`truncate transition-[opacity,width] duration-200 ${collapsed && !isMobile ? "w-0 opacity-0" : "w-auto opacity-100"}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-outline-variant p-3">
          <div className={`flex items-center rounded-lg bg-surface-container-low p-2 transition-all duration-200 ${collapsed && !isMobile ? "justify-center" : "justify-between gap-3"}`}>
            <div className={`flex min-w-0 items-center gap-3 ${collapsed && !isMobile ? "hidden" : "flex"}`}>
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-label-md text-label-md font-bold text-primary">
                {(user?.name || "A").slice(0, 1).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate font-label-md text-label-md font-bold text-on-surface">{user?.name || "Administrator"}</p>
                <p className="truncate font-label-sm text-label-sm text-on-surface-variant">{user?.email || "System User"}</p>
              </div>
            </div>

            <button
              aria-label="Logout"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-surface-variant transition-colors hover:bg-error/10 hover:text-error"
              onClick={logout}
              title="Logout"
              type="button"
            >
              <LogOut size={18} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}