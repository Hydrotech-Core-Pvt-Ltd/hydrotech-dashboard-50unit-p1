import Sidebar from "../components/Sidebar";
import MeterCard from "../components/MeterCard";
import CombinedMeterCard from "../components/CombinedMeterCard";
import useMeters from "../hooks/useMeters";
import useUser from "../hooks/useUser";
import { Search, Droplets, AlertTriangle, Wifi } from "lucide-react";
import { useState } from "react";
import { auth } from "../config/firebase";
import Analytics from "./Analytics";
import Devices from "./Devices";
import Settings from "./Settings";

export default function Dashboard({ uid }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const allMeters = useMeters();
  const { user, loading: userLoading } = useUser(uid);
  const [searchQuery, setSearchQuery] = useState("");

  // Show all meters only for admins (case-insensitive). For other users,
  // try to detect their unit id from several possible fields and filter meters.
  let meters = allMeters;
  const role = (user?.role || "").toString().toLowerCase();
  if (role !== "admin" && user) {
    // Try multiple user fields that might contain unit information
    const possibleUnit = (
      user.unitId || user.unit || user.unitNumber || user.unit_number || user.apartment || ""
    ).toString().trim();

    const userUnit = possibleUnit;
    const normalize = (s = "") => s.toString().toLowerCase().replace(/[^a-z0-9]/g, "");
    const numeric = (s = "") => s.toString().replace(/[^0-9]/g, "");

    if (userUnit) {
      const nUser = normalize(userUnit);
      const numUser = numeric(userUnit);
      meters = allMeters.filter((m) => {
        const apt = (m.Apartment || "").toString();
        const mid = (m.Meter_ID || "").toString();
        const nApt = normalize(apt);
        const nMid = normalize(mid);
        const numApt = numeric(apt);
        const numMid = numeric(mid);

        // Exact normalized match for meter id (covers '#M-102' vs 'M-102')
        if (nMid && nMid === nUser) return true;
        // Numeric match: user '102' matches 'Apt 102' or meter id 'M-102'
        if (numUser && (numUser === numApt || numUser === numMid)) return true;
        // Fallback: substring match on normalized strings
        if (nMid.includes(nUser) || nApt.includes(nUser)) return true;
        return false;
      });
    } else {
      // No unit info found on user; default to empty list for safety
      meters = [];
    }
  }

  // Calculate summary stats
  const totalConsumption = meters.reduce(
    (sum, m) => sum + (Number(m.Total_Units) || 0),
    0
  );
  const activeAlerts = meters.filter(m => m.Status !== "normal").length;
  const onlineMeters = meters.filter(m => m.Valve_Status).length;

  // Filter meters based on search
  const filteredMeters = meters.filter(m => 
    m.Meter_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.Apartment?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#0a1628] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
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
                  {user?.role === "resident" ? `Unit ${user?.unitId?.split(" ")[1]}` : "Dashboard"}
                </h1>
                <p className="text-gray-400 text-sm">
                  {user?.role === "resident" 
                    ? "Your water meter consumption & status"
                    : `Overview of ${meters.length} active IoT water meters`
                  }
                </p>
              </div>
              
              {/* Search Bar - Only for Admin */}
              {user?.role === "admin" && (
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

            {/* Admin View - Summary Cards */}
            {user?.role === "admin" && (
              <div className="grid grid-cols-3 gap-6 mb-8">
                {/* Total Consumption */}
                <div className="bg-[#0f1e36]/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center">
                      <Droplets className="text-cyan-400" size={28} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Total Consumption</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{totalConsumption.toLocaleString()}</span>
                        <span className="text-gray-400 text-sm">M³</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Active Alerts */}
                <div className="bg-[#0f1e36]/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-red-500/10 border border-red-400/20 flex items-center justify-center">
                      <AlertTriangle className="text-red-400" size={28} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Active Alerts</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{activeAlerts}</span>
                        <span className="text-gray-400 text-sm">UNITS</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Online Meters */}
                <div className="bg-[#0f1e36]/40 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-xl bg-emerald-500/10 border border-emerald-400/20 flex items-center justify-center">
                      <Wifi className="text-emerald-400" size={28} />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm mb-1">Online Meters</p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">{onlineMeters}</span>
                        <span className="text-gray-400 text-sm">ACTIVE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Resident View - Detailed Stats */}
            {user?.role === "resident" && (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Current Consumption */}
                <div className="bg-[#0f1e36]/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm font-semibold">Current Consumption</p>
                    <Droplets className="text-cyan-400" size={24} />
                  </div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold text-white">{totalConsumption}</span>
                    <span className="text-gray-400 text-lg">M³</span>
                  </div>
                  <p className="text-gray-500 text-xs">Total units consumed</p>
                </div>

                {/* Status */}
                <div className="bg-[#0f1e36]/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-gray-400 text-sm font-semibold">Status</p>
                    <Wifi className="text-emerald-400" size={24} />
                  </div>
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      meters[0]?.Status === "normal" 
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30"
                        : "bg-red-500/20 text-red-300 border border-red-400/30"
                    }`}>
                      {meters[0]?.Status === "normal" ? "● NORMAL" : "● ALERT"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">Meter is {meters[0]?.Valve_Status === "open" ? "active" : "inactive"}</p>
                </div>
              </div>
            )}

            {/* Meter Cards Grid */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">
                {user?.role === "resident" ? "Your Meter" : "All Meters"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-1 gap-6">
                <CombinedMeterCard meter={filteredMeters[0] || meters[0]} />
              </div>
            </div>
          </>
        )}

        {activeIndex === 1 && <Analytics />}
        {activeIndex === 2 && <Devices meters={meters} />}
        {activeIndex === 3 && <Settings user={user} />}
      </main>
    </div>
  );
}
