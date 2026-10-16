import Sidebar from "../components/Sidebar";
import CombinedMeterCard from "../components/CombinedMeterCard";
import useMeters from "../hooks/useMeters";
import { ROLE_MAP } from "../config/roles";
import { Search, Droplets, AlertTriangle, Wifi, Menu } from "lucide-react";
import { useState } from "react";
import { auth } from "../config/firebase";
import Analytics from "./Analytics";
import Devices from "./Devices";
import Settings from "./Settings";

export default function Dashboard({ authUser }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const allMeters = useMeters();
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const roleConfig = ROLE_MAP[authUser?.uid] ?? null;
  const role = (roleConfig?.role || "").toString().toLowerCase();
  const user = authUser ? { ...authUser, ...roleConfig } : roleConfig;
  const isAdmin = role === "admin";
  const isResident = role === "resident";
  const hasAccess = Boolean(roleConfig) && (isAdmin || isResident);

  const visibleMeters = isAdmin
    ? allMeters
    : isResident
      ? allMeters.slice(0, 1)
      : [];

  const filteredMeters = isAdmin
    ? visibleMeters.filter((meter) =>
        meter.Meter_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meter.Apartment?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : visibleMeters;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-2xl border border-white/10 bg-[#0f1e36]/50 p-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-3">No access configured</h1>
          <p className="text-gray-400 text-sm mb-6">
            This authenticated account is not configured for dashboard access.
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await auth.signOut();
              } catch (error) {
                console.error("Logout error:", error);
              }
            }}
            className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white font-semibold py-3 rounded-xl transition-all duration-200"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="flex h-dvh bg-[#0a1628]">
      <Sidebar
        user={user}
        onLogout={handleLogout}
        activeIndex={activeIndex}
        onNavigate={(index) => {
          setActiveIndex(index);
          setMenuOpen(false);
        }}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar - mobile only */}
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-[#0a1628]/90 px-4 py-3 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-white/80"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <Droplets className="text-cyan-300" size={20} />
          <p className="font-semibold tracking-tight">HydroTech</p>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">
        {activeIndex === 0 && (
          <>
            {/* Header */}
            <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-start mb-6 md:mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {isResident ? "Resident Dashboard" : "Dashboard"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {isResident
                    ? "Your assigned water meter consumption & status"
                    : `Overview of ${filteredMeters.length} active IoT water meters`
                  }
                </p>
              </div>
              
              {/* Search Bar - Only for Admin */}
              {isAdmin && (
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="text"
                    placeholder="Search apartment or meter ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#0f1e36]/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Meter Readings</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 max-w-5xl">
                {filteredMeters.map((m) => (
                  <CombinedMeterCard key={m.id} meter={m} />
                ))}
              </div>
            </div>
          </>
        )}

        {activeIndex === 1 && <Analytics />}
        {activeIndex === 2 && <Devices meters={filteredMeters} />}
        {activeIndex === 3 && <Settings user={user} />}
        </div>
      </main>
    </div>
  );
}
