import WaveSparkline from "./WaveSparkline";
import { useState } from "react";
import { Droplets, Clock, Power } from "lucide-react";
import { ref as dbRef, update } from "firebase/database";
import { realtimeDb } from "../config/firebase";

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

function getSeriesFromHistory(history = [], keys = []) {
  if (!Array.isArray(history)) return [];
  return history
    .map((item) => {
      if (item == null) return null;
      for (const k of keys) {
        // direct key
        if (item[k] != null) return Number(item[k]);
        // lowercase key
        if (item[k.toLowerCase()] != null) return Number(item[k.toLowerCase()]);
        // nested readings.current
        if (item.readings && item.readings.current && item.readings.current[k] != null) return Number(item.readings.current[k]);
        if (item.readings && item.readings.current && item.readings.current[k.toLowerCase()] != null) return Number(item.readings.current[k.toLowerCase()]);
        // nested readings
        if (item.readings && item.readings[k] != null) return Number(item.readings[k]);
        // value field
        if (item.value != null) return Number(item.value);
        // nested measurement in a generic field
        if (item.measurement != null && item.measurement[k] != null) return Number(item.measurement[k]);
      }
      return null;
    })
    .filter((v) => Number.isFinite(v));
}

export default function CombinedMeterCard({ meter }) {
  const [copied, setCopied] = useState(false);
  const [togglingValve, setTogglingValve] = useState(false);
  const [expanded, setExpanded] = useState(() => Array.isArray(meter?.history) && meter.history.length > 0);

  if (!meter) return null;

  function copyHistoryPath() {
    const id = meter.Meter_ID || meter.serialNumber || meter.id || 'METER_UNKNOWN';
    const path = `Meters/${id}/history`;
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(path).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }).catch(() => {
        // fallback
        // eslint-disable-next-line no-alert
        window.prompt('Copy history path', path);
      });
    } else {
      // fallback for older browsers
      // eslint-disable-next-line no-alert
      window.prompt('Copy history path', path);
    }
  }

  function toggleExpanded() {
    setExpanded((s) => !s);
  }

  async function toggleValve() {
    const meterId = meter.id || meter.serialNumber || meter.Meter_ID;
    if (!meterId || togglingValve) return;

    const isValveOpen = String(meter.Valve_Status || meter.valve_status || "closed").toLowerCase() === "open";

    try {
      setTogglingValve(true);
      await update(dbRef(realtimeDb, `Meters/${meterId}`), {
        Valve_Status: isValveOpen ? "closed" : "open",
        valve_status: isValveOpen ? "closed" : "open",
      });
    } catch (error) {
      console.error("Error toggling valve:", error);
    } finally {
      setTogglingValve(false);
    }
  }

  const isValveOpen = String(meter.Valve_Status || meter.valve_status || "closed").toLowerCase() === "open";
  const latestFlow = Array.isArray(meter.Flow_Rate) && meter.Flow_Rate.length ? meter.Flow_Rate[meter.Flow_Rate.length - 1] : Number(meter.Flow_Rate) || 0;
  const isNormal = meter.Status === "normal";
  const updated = meter.Timestamp ? new Date(Number(meter.Timestamp) * 1000).toLocaleString() : "-";
  const dailyLiters = Number(meter.Daily_Liters ?? 0);
  const totalM3 = Number(meter.Total_M3 ?? 0);
  const hasHistory = Array.isArray(meter.history) && meter.history.length > 0;
  const sparklineData = hasHistory
    ? getSeriesFromHistory(meter.history, ["Flow_Rate", "flow_rate", "value"]) 
    : (Array.isArray(meter.Flow_Rate) ? meter.Flow_Rate : (meter.Flow_Rate !== undefined ? [Number(meter.Flow_Rate) || 0] : []));

  return (
    <div className="relative overflow-hidden rounded-[2rem] p-[1px] bg-gradient-to-br from-cyan-400/40 via-slate-700/20 to-sky-500/35 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
      <div className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(145deg,_rgba(7,18,38,0.98),_rgba(11,28,49,0.96)_48%,_rgba(15,39,64,0.98))] p-6 border border-white/5">
      <div className="absolute inset-0 pointer-events-none opacity-35">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-sky-500/12 blur-3xl" />
        <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="inline-flex items-center gap-3 mb-2">
            <div className="h-12 w-12 flex items-center justify-center rounded-[1.1rem] bg-gradient-to-br from-cyan-400/18 to-sky-500/8 border border-cyan-300/15 shadow-[0_0_24px_rgba(34,211,238,0.18)] backdrop-blur">
              <Droplets className="text-cyan-200" size={20} />
            </div>
            <div>
              <div className="text-[10px] uppercase font-semibold tracking-[0.35em] text-cyan-200/70">Live Meter</div>
              <div className="text-xl font-semibold text-white tracking-tight">{meter.serialNumber || meter.Meter_ID}</div>
            </div>
          </div>
          <div className="text-sm text-gray-300 flex items-center gap-2"><Clock size={14} /> Updated {updated}</div>
        </div>

        <div className="text-right flex flex-col items-end gap-3">
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] ${isNormal ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-400/20' : 'bg-rose-500/10 text-rose-200 border border-rose-400/20'}`}>
            {isNormal ? '● NORMAL' : '● ALERT'}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-[0.22em]">Valve Control</div>
          <div className="flex items-center justify-end gap-3">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-[0.18em] border ${
              isValveOpen
                ? "bg-emerald-500/10 text-emerald-200 border-emerald-400/20"
                : "bg-rose-500/10 text-rose-200 border-rose-400/20"
            }`}>
              <span className={`h-2 w-2 rounded-full ${isValveOpen ? "bg-emerald-300" : "bg-rose-300"}`} />
              {isValveOpen ? "Valve Open" : "Valve Closed"}
            </div>
            <button
              type="button"
              onClick={toggleValve}
              disabled={togglingValve}
              className={`group relative inline-flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.22em] transition disabled:opacity-60 disabled:cursor-not-allowed ${
                isValveOpen
                  ? "border-emerald-300/25 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/18"
                  : "border-rose-300/25 bg-rose-500/10 text-rose-100 hover:bg-rose-500/18"
              }`}
              title={isValveOpen ? "Close valve" : "Open valve"}
            >
              <span className={`absolute inset-0 opacity-0 blur-2xl transition group-hover:opacity-100 ${isValveOpen ? 'bg-emerald-400/20' : 'bg-rose-400/20'}`} />
              <span className={`relative inline-flex h-5 w-5 items-center justify-center rounded-full border ${isValveOpen ? 'border-emerald-200/30 bg-emerald-400/10' : 'border-rose-200/30 bg-rose-400/10'}`}>
                <Power size={12} />
              </span>
              <span className="relative">{togglingValve ? "Updating..." : isValveOpen ? "Close" : "Open"}</span>
            </button>
          </div>
          <div className="text-xs text-gray-400">Active: <span className="text-white ml-1">{meter.isActive ? 'Yes' : 'No'}</span></div>
        </div>
      </div>

      {/* Stats grid — flat, no nesting */}
         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-4">
        {(() => {
          const flowStr = fmt(latestFlow);
          const pressureStr = fmt(meter.Pressure);
          const dailyStr = fmtNumber(dailyLiters, 5);
          const totalStr = fmtNumber(totalM3, 5);
          return (
            <>
                 <div className="relative h-36 md:h-44 rounded-[1.4rem] border border-white/8 bg-white/4 flex flex-col items-center justify-center gap-2 p-6 overflow-hidden backdrop-blur-sm">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-cyan-300/80 via-cyan-400/30 to-transparent" />
                <div className="text-[11px] uppercase font-semibold tracking-[0.28em] text-cyan-200/70 text-center">Flow Rate</div>
                <div className={`${numSizeClass(flowStr)} font-semibold text-white w-full text-center leading-none`}>{flowStr}</div>
                <div className="text-cyan-100/70 text-[11px] tracking-[0.22em]">L/MIN</div>
              </div>

                 <div className="relative h-36 md:h-44 rounded-[1.4rem] border border-white/8 bg-white/4 flex flex-col items-center justify-center gap-2 p-6 overflow-hidden backdrop-blur-sm">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-sky-300/80 via-sky-400/30 to-transparent" />
                <div className="text-[11px] uppercase font-semibold tracking-[0.28em] text-sky-200/70 text-center">Pressure</div>
                <div className={`${numSizeClass(pressureStr)} font-semibold text-white w-full text-center leading-none`}>{pressureStr}</div>
                <div className="text-sky-100/70 text-[11px] tracking-[0.22em]">BAR</div>
              </div>

                 <div className="relative h-36 md:h-44 rounded-[1.4rem] border border-white/8 bg-white/4 flex flex-col items-center justify-center gap-2 p-6 overflow-hidden backdrop-blur-sm">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-emerald-300/80 via-emerald-400/30 to-transparent" />
                <div className="text-[11px] uppercase font-semibold tracking-[0.28em] text-emerald-200/70 text-center">Daily Liters</div>
                <div className={`${numSizeClass(dailyStr)} font-semibold text-emerald-200 w-full text-center leading-none`}>{dailyStr}</div>
                <div className="text-emerald-100/70 text-[11px] tracking-[0.22em]">L</div>
              </div>

                 <div className="relative h-36 md:h-44 rounded-[1.4rem] border border-white/8 bg-white/4 flex flex-col items-center justify-center gap-2 p-6 overflow-hidden backdrop-blur-sm">
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-violet-300/80 via-violet-400/30 to-transparent" />
                <div className="text-[11px] uppercase font-semibold tracking-[0.28em] text-violet-200/70 text-center">Total M3</div>
                <div className={`${numSizeClass(totalStr)} font-semibold text-white w-full text-center leading-none`}>{totalStr}</div>
                <div className="text-violet-100/70 text-[11px] tracking-[0.22em]">m³</div>
              </div>
            </>
          );
        })()}
      </div>

      {/* Sparkline + per-metric history */}
      <div className="rounded-[1.6rem] border border-white/6 bg-white/[0.03] p-4 backdrop-blur-sm">
        <div className="mb-3 rounded-xl border border-white/5 bg-black/10 p-3">
          <WaveSparkline data={sparklineData} />
        </div>

        {hasHistory && (
          <>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={toggleExpanded} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-100 text-sm border border-indigo-400/20">
                {expanded ? 'Hide graphs' : 'View graphs'}
              </button>
              <button onClick={copyHistoryPath} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/15 hover:bg-sky-500/25 text-sky-100 text-sm border border-sky-400/20">
                Copy history path
              </button>
              {copied && <span className="ml-3 text-emerald-300 text-sm">Copied!</span>}
            </div>

            {expanded && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-3 bg-white/4 rounded-2xl border border-white/5">
                  <div className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-2">Flow Rate</div>
                  <WaveSparkline data={getSeriesFromHistory(meter.history, ["Flow_Rate", "flow_rate", "value"]) } className="w-full h-36" height={36} />
                </div>

                <div className="p-3 bg-white/4 rounded-2xl border border-white/5">
                  <div className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-2">Pressure</div>
                  <WaveSparkline data={getSeriesFromHistory(meter.history, ["Pressure", "pressure"]) } className="w-full h-36" height={36} />
                </div>

                <div className="p-3 bg-white/4 rounded-2xl border border-white/5">
                  <div className="text-xs uppercase tracking-[0.22em] text-gray-400 mb-2">Daily Consumption</div>
                  <WaveSparkline data={getSeriesFromHistory(meter.history, ["Daily_consumption","Daily_Liters","daily_liters"]) } className="w-full h-36" height={36} />
                </div>
              </div>
            )}

          </>
        )}

        {!hasHistory && (
          <div className="mt-3 flex items-center justify-between">
            <div>
              <button onClick={copyHistoryPath} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/15 hover:bg-sky-500/25 text-sky-100 text-sm border border-sky-400/20">
                Copy history path
              </button>
              {copied && <span className="ml-3 text-emerald-300 text-sm">Copied!</span>}
            </div>

            <div className="text-sm text-gray-400">History points: <span className="text-white ml-1">{Array.isArray(sparklineData) ? sparklineData.length : 0}</span></div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}