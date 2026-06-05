import WaveSparkline from "./WaveSparkline";
import { Droplets, Gauge, Clock, Zap, TimerReset } from "lucide-react";

function fmt(v) {
  if (v === undefined || v === null) return "0";
  if (typeof v === "number") return v.toLocaleString();
  return String(v);
}

function fmtNumber(v, dp = 5) {
  const n = Number(v);
  if (!Number.isFinite(n)) return "0";
  const s = n.toFixed(dp).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, "");
  return s;
}

// Scale font down based on digit count — always shows full number
function numSizeClass(str) {
  if (str.length <= 3)  return "text-3xl md:text-4xl";
  if (str.length <= 5)  return "text-2xl md:text-3xl";
  if (str.length <= 7)  return "text-xl md:text-2xl";
  if (str.length <= 9)  return "text-lg md:text-xl";
  return "text-sm md:text-base";
}

export default function CombinedMeterCard({ meter }) {
  if (!meter) return null;
  const latestFlow = Array.isArray(meter.Flow_Rate) && meter.Flow_Rate.length ? meter.Flow_Rate[meter.Flow_Rate.length - 1] : Number(meter.Flow_Rate) || 0;
  const isNormal = meter.Status === "normal";
  const updated = meter.Timestamp ? new Date(Number(meter.Timestamp) * 1000).toLocaleString() : "-";
  const dailyLiters = Number(meter.Daily_Liters ?? 0);
  const totalM3 = Number(meter.Total_M3 ?? 0);
  const hasHistory = Array.isArray(meter.history) && meter.history.length > 0;
  const sparklineData = hasHistory
    ? meter.history.map((item) => Number(item?.Flow_Rate ?? item?.flow_rate ?? item?.value)).filter((value) => Number.isFinite(value))
    : meter.Flow_Rate;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#071226] via-[#0b1c31] to-[#0f2740] rounded-3xl p-6 border border-white/8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/10 shadow-inner shadow-cyan-500/10">
              <Droplets className="text-cyan-300" size={20} />
            </div>
            <div>
              <div className="text-xs uppercase font-medium tracking-[0.25em] text-gray-400">Meter</div>
              <div className="text-xl font-bold text-white">{meter.serialNumber || meter.Meter_ID}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2"><Clock size={14} /> Timestamp: {updated}</div>
        </div>

        <div className="text-right">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isNormal ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20' : 'bg-red-500/10 text-red-300 border border-red-400/20'}`}>
            {isNormal ? '● NORMAL' : '● ALERT'}
          </div>
          <div className="mt-3 text-sm text-gray-400">Active: <span className="text-white ml-1">{meter.isActive ? 'Yes' : 'No'}</span></div>
        </div>
      </div>

      {/* Stats grid — flat, no nesting */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-4">
        {(() => {
          const flowStr = fmt(latestFlow);
          const pressureStr = fmt(meter.Pressure);
          const dailyStr = fmtNumber(dailyLiters, 5);
          const totalStr = fmtNumber(totalM3, 5);
          return (
            <>
                 <div className="h-36 md:h-44 rounded-2xl border border-white/6 bg-white/4 flex flex-col items-center justify-center gap-3 p-6 overflow-hidden">
                <div className="text-xs uppercase font-medium tracking-normal text-gray-400 text-center">Flow Rate</div>
                <div className={`${numSizeClass(flowStr)} font-semibold text-white w-full text-center`}>{flowStr}</div>
                <div className="text-gray-300 text-xs">L/MIN</div>
              </div>

                 <div className="h-36 md:h-44 rounded-2xl border border-white/6 bg-white/4 flex flex-col items-center justify-center gap-3 p-6 overflow-hidden">
                <div className="text-xs uppercase font-medium tracking-normal text-gray-400 text-center">Pressure</div>
                <div className={`${numSizeClass(pressureStr)} font-semibold text-white w-full text-center`}>{pressureStr}</div>
                <div className="text-gray-300 text-xs">BAR</div>
              </div>

                 <div className="h-36 md:h-44 rounded-2xl border border-white/6 bg-white/4 flex flex-col items-center justify-center gap-3 p-6 overflow-hidden">
                <div className="text-xs uppercase font-medium tracking-normal text-gray-400 text-center">Daily Liters</div>
                <div className={`${numSizeClass(dailyStr)} font-semibold text-cyan-300 w-full text-center`}>{dailyStr}</div>
                <div className="text-gray-300 text-xs">L</div>
              </div>

                 <div className="h-36 md:h-44 rounded-2xl border border-white/6 bg-white/4 flex flex-col items-center justify-center gap-3 p-6 overflow-hidden">
                <div className="text-xs uppercase font-medium tracking-normal text-gray-400 text-center">Total M3</div>
                <div className={`${numSizeClass(totalStr)} font-semibold text-white w-full text-center`}>{totalStr}</div>
                <div className="text-gray-300 text-xs">m³</div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Sparkline */}
      <div className="bg-transparent rounded-lg p-4">
        <div className="mb-3">
          <WaveSparkline data={sparklineData} />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2"><Gauge size={16} /> <span>Latest readings</span></div>
          <div>History points: <span className="text-white ml-1">{Array.isArray(sparklineData) ? sparklineData.length : 0}</span></div>
        </div>
      </div>
    </div>
  );
}