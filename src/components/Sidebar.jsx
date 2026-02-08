import { LayoutGrid, BarChart3, Monitor, Settings, User, Droplets, LogOut, Shield, Home } from "lucide-react";

const nav = [
  { icon: LayoutGrid, label: "Dashboard" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Monitor, label: "Devices" },
  { icon: Settings, label: "Settings" },
];

export default function Sidebar({ user, onLogout }) {
  const activeIndex = 0;

  return (
    <aside className="h-screen w-72 bg-linear-to-b from-[#0c1730] via-[#0b1428] to-[#0a1224] border-r border-white/10 px-6 py-7 flex flex-col">
      <div className="flex items-center gap-3 pb-6 border-b border-white/10">
        <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center shadow-[0_0_18px_rgba(34,211,238,0.35)]">
          <Droplets className="text-cyan-300" size={24} />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">HydroTech</p>
        </div>
      </div>

      <nav className="mt-6 flex-1">
        <ul className="space-y-2">
          {nav.map(({ icon: Icon, label }, index) => (
            <li key={label}>
              <button
                type="button"
                className={`w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-left transition ${
                  index === activeIndex
                    ? "bg-cyan-500/15 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.18)]"
                    : "text-white/65 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={20} className={index === activeIndex ? "text-cyan-300" : "text-white/60"} />
                <span className="text-sm font-medium">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="pt-6 border-t border-white/10">
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`h-11 w-11 rounded-2xl flex items-center justify-center ${
              user?.role === "admin" 
                ? "bg-emerald-500/10 border border-emerald-400/20" 
                : "bg-cyan-500/10 border border-cyan-400/20"
            }`}>
              {user?.role === "admin" ? (
                <Shield size={18} className="text-emerald-200" />
              ) : (
                <Home size={18} className="text-cyan-200" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{user?.email || "User"}</p>
              <p className="text-xs text-white/55 capitalize">{user?.role || "Loading..."}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-red-500/20 hover:border-red-400/20 transition-all"
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
