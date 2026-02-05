import { Home, BarChart, Cpu, Settings, User, Droplets, LogOut } from "lucide-react";

const nav = [
  { icon: Home, label: "Dashboard" },
  { icon: BarChart, label: "Analytics" },
  { icon: Cpu, label: "Devices" },
  { icon: Settings, label: "Settings" },
  { icon: User, label: "Profile" },
];

export default function Sidebar() {
  const activeIndex = 0;

  return (
    <aside className="h-screen w-72 bg-gradient-to-b from-[#0c1730] via-[#0b1428] to-[#0a1224] border-r border-white/10 px-6 py-7 flex flex-col">
      <div className="flex items-center gap-3 pb-6 border-b border-white/10">
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center shadow-[0_0_18px_rgba(16,185,129,0.35)]">
          <Droplets className="text-emerald-300" size={24} />
        </div>
        <div>
          <p className="text-lg font-semibold tracking-tight">HydroTech</p>
          <p className="text-xs text-white/60">Control center</p>
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
            <div className="h-11 w-11 rounded-2xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
              <User size={18} className="text-emerald-200" />
            </div>
            <div>
              <p className="text-sm font-semibold">User</p>
              <p className="text-xs text-white/55">Operator</p>
            </div>
          </div>
          <button
            type="button"
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
