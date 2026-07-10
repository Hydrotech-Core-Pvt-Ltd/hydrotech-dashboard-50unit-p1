import Sidebar from "../components/Sidebar";
import CombinedMeterCard from "../components/CombinedMeterCard";
import useMeters from "../hooks/useMeters";
import { ROLE_MAP } from "../config/roles";
import { Search, Droplets, AlertTriangle, Wifi } from "lucide-react";
import { useState } from "react";
import { auth } from "../config/firebase";
import Analytics from "./Analytics";
import Devices from "./Devices";
import Settings from "./Settings";

export default function Dashboard({ authUser }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const allMeters = useMeters();
  const [searchQuery, setSearchQuery] = useState("");

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
    <div className="flex h-screen bg-[#0a1628]">
      <Sidebar user={user} onLogout={handleLogout} activeIndex={activeIndex} onNavigate={setActiveIndex} />

      <main className="flex-1 p-8 overflow-y-auto">
        {activeIndex === 0 && (
          <>
            {/* Header */}
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
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
                <div className="relative w-96">
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
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
      </main>
    </div>
  );
}
