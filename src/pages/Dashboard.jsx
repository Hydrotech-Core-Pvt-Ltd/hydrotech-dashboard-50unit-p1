import Sidebar from "../components/Sidebar";
import MeterCard from "../components/MeterCard";
import useMeters from "../hooks/useMeters";
import { Search, Droplets, AlertTriangle, Wifi } from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const meters = useMeters();
  const [searchQuery, setSearchQuery] = useState("");

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

  return (
    <div className="flex h-screen bg-[#0a1628]">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
            <p className="text-gray-400 text-sm">Overview of {meters.length} active IoT water meters</p>
          </div>
          
          {/* Search Bar */}
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
        </div>

        {/* Summary Cards */}
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

        {/* Meter Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredMeters.map(m => (
            <MeterCard key={m.id} meter={m} />
          ))}
        </div>
      </main>
    </div>
  );
}
