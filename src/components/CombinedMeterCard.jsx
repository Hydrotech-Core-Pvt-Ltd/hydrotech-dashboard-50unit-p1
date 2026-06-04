import WaveSparkline from "./WaveSparkline";
import { Droplets, Gauge, Clock, Zap, TimerReset } from "lucide-react";

function fmt(v) {
  if (v === undefined || v === null) return "0";
  if (typeof v === "number") return v.toLocaleString();
  return String(v);
}

export default function CombinedMeterCard({ meter }) {
  if (!meter) return null;
  const latestFlow = Array.isArray(meter.Flow_Rate) && meter.Flow_Rate.length ? meter.Flow_Rate[meter.Flow_Rate.length - 1] : Number(meter.Flow_Rate) || 0;
  const isNormal = meter.Status === "normal";
  const updated = meter.Timestamp ? new Date(Number(meter.Timestamp) * 1000).toLocaleString() : "-";
  const dailyLiters = Number(meter.Daily_Liters || 0);
  const totalM3 = Number(meter.Total_M3 || 0);
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

      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-400/10 shadow-inner shadow-cyan-500/10">
              <Droplets className="text-cyan-300" size={20} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.25em] text-gray-400">Meter</div>
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="md:col-span-1 rounded-2xl border border-white/6 bg-white/4 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 mb-3"><Zap size={14} /> Flow Rate</div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-semibold text-white leading-none">{fmt(latestFlow)}</div>
            <div className="text-gray-400 text-sm pb-1">L/MIN</div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/6 bg-white/4 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 mb-3"><Gauge size={14} /> Pressure</div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-semibold text-white leading-none">{fmt(meter.Pressure)}</div>
            <div className="text-gray-400 text-sm pb-1">BAR</div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/6 bg-white/4 p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400 mb-3"><TimerReset size={14} /> Daily Liters</div>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-semibold text-white leading-none">{fmt(dailyLiters)}</div>
            <div className="text-gray-400 text-sm pb-1">L</div>
          </div>
        </div>

        <div className="md:col-span-1 rounded-2xl border border-white/6 bg-white/4 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-3">Total M3</p>
          <div className="flex items-end gap-2">
            <div className="text-4xl font-semibold text-white leading-none">{fmt(totalM3)}</div>
            <div className="text-gray-400 text-sm pb-1">m³</div>
          </div>
        </div>
      </div>

      <div className="mt-2 bg-transparent rounded-lg p-2">
        <div className="mb-2">
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
