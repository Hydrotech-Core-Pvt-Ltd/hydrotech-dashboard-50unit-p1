import WaveSparkline from "./WaveSparkline";
import { Droplets, Gauge, Clock } from "lucide-react";

function fmt(v) {
  if (v === undefined || v === null) return "0";
  if (typeof v === "number") return v.toLocaleString();
  return String(v);
}

export default function CombinedMeterCard({ meter }) {
  if (!meter) return null;
  const latestFlow = Array.isArray(meter.Flow_Rate) && meter.Flow_Rate.length ? meter.Flow_Rate[meter.Flow_Rate.length - 1] : Number(meter.Flow_Rate) || 0;
  const isNormal = meter.Status === "normal";
  const updated = meter.Last_Updated ? new Date(meter.Last_Updated).toLocaleString() : "-";
  const monthly = Number(meter.Monthly_Units || 0);
  const total = Number(meter.Total_Units || 1);
  const pct = Math.round(Math.min(100, (monthly / Math.max(1, total)) * 100));

  return (
    <div className="bg-gradient-to-br from-[#071226] to-[#0f2740] rounded-2xl p-6 border border-white/6 shadow-lg">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-400/10">
              <Droplets className="text-cyan-300" size={20} />
            </div>
            <div>
              <div className="text-xs text-gray-400">Meter</div>
              <div className="text-lg font-bold text-white">{meter.serialNumber || meter.Meter_ID}</div>
            </div>
          </div>
          <div className="text-sm text-gray-400 flex items-center gap-2"><Clock size={14} /> Last: {updated}</div>
        </div>

        <div className="text-right">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${isNormal ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-400/20' : 'bg-red-500/10 text-red-300 border border-red-400/20'}`}>
            {isNormal ? '● NORMAL' : '● ALERT'}
          </div>
          <div className="mt-3 text-sm text-gray-400">Active: <span className="text-white ml-1">{meter.isActive ? 'Yes' : 'No'}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="col-span-1 md:col-span-1 bg-white/3 rounded-xl p-4">
          <p className="text-xs text-gray-300">Flow Rate</p>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-white">{fmt(latestFlow)}</div>
            <div className="text-gray-400 text-sm">L/MIN</div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 bg-white/3 rounded-xl p-4">
          <p className="text-xs text-gray-300">Pressure</p>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-white">{fmt(meter.Pressure)}</div>
            <div className="text-gray-400 text-sm">BAR</div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-1 bg-white/3 rounded-xl p-4 flex flex-col justify-between">
          <p className="text-xs text-gray-300">Total Units</p>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-white">{fmt(meter.Total_Units)}</div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-2">Monthly usage</div>
            <div className="w-full bg-white/6 rounded-full h-2 overflow-hidden">
              <div className="h-2 bg-cyan-400" style={{ width: `${pct}%` }} />
            </div>
            <div className="text-xs text-gray-300 mt-2">{fmt(monthly)} / {fmt(total)} ({pct}%)</div>
          </div>
        </div>
      </div>

      <div className="mt-2 bg-transparent rounded-lg p-2">
        <div className="mb-2">
          <WaveSparkline data={meter.Flow_Rate} />
        </div>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-2"><Gauge size={16} /> <span>Flow trend</span></div>
          <div>Daily: <span className="text-white ml-1">{fmt(meter.Daily_consumption)}</span></div>
        </div>
      </div>
    </div>
  );
}
