import WaveSparkline from "./WaveSparkline";
import { Power } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function MeterCard({ meter }) {
  const isNormal = meter.Status === "normal";
  const isValveOpen = meter.Valve_Status === "open";

  const toggleValve = async () => {
    try {
      await updateDoc(doc(db, "units", meter.id), {
        valve_status: isValveOpen ? "closed" : "open",
      });
      console.log(`Valve ${meter.id} toggled to ${isValveOpen ? "closed" : "open"}`);
    } catch (error) {
      console.error("Error toggling valve:", error);
    }
  };
  
  return (
    <div className="bg-[#0f1e36]/40 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-cyan-500/30 transition">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="inline-block px-2 py-1 rounded bg-white/5 text-gray-400 text-xs mb-2">
            {meter.Meter_ID || "#M-001"}
          </div>
          <h3 className="text-lg font-bold text-white">
            {meter.Apartment || "Apt Apt 101"}
          </h3>
        </div>
        <button
          onClick={toggleValve}
          className={`h-10 w-10 rounded-xl flex items-center justify-center transition hover:scale-110 active:scale-95 ${
            isValveOpen
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
              : "bg-gray-500/20 text-gray-400 border border-gray-500/30 hover:bg-gray-500/30"
          }`}
          title={isValveOpen ? "Close Valve" : "Open Valve"}
        >
          <Power size={18} />
        </button>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
          isNormal 
            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            : "bg-red-500/20 text-red-400 border border-red-500/30"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            isNormal ? "bg-emerald-400" : "bg-red-400"
          }`} />
          {isNormal ? "NORMAL" : "ALERT"}
        </span>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-6 mb-4">
        <div>
          <p className="text-gray-400 text-xs mb-1">Flow Rate</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">
              {meter.Flow_Rate?.[meter.Flow_Rate.length - 1]?.toFixed(1) || "8.5"}
            </span>
            <span className="text-gray-400 text-xs">L/MIN</span>
          </div>
        </div>
        <div>
          <p className="text-gray-400 text-xs mb-1">Pressure</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">
              {meter.Pressure || "40.7"}
            </span>
            <span className="text-gray-400 text-xs">BAR</span>
          </div>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-4">
        <WaveSparkline data={meter.Flow_Rate} />
      </div>
    </div>
  );
}
