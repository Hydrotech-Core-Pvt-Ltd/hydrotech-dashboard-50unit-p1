import { Wifi, ToggleRight, Circle } from "lucide-react";

export default function Devices({ meters = [] }) {
  // Create dummy devices from meters if provided, otherwise sample list
  const list = meters.length
    ? meters.slice(0, 6).map((m, i) => ({ id: m.id || i, name: m.Meter_ID || `Meter-${i+1}`, status: m.Valve_Status ? "online" : "offline" }))
    : [
        { id: 1, name: "Meter-101", status: "online" },
        { id: 2, name: "Meter-102", status: "offline" },
        { id: 3, name: "Meter-103", status: "online" },
      ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Devices</h1>
          <p className="text-gray-400 text-sm">List of connected meters (dummy data)</p>
        </div>
        <div className="text-white/60 flex items-center gap-3">
          <Wifi size={18} />
          <span className="text-sm">{list.filter(d => d.status === "online").length} online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((d) => (
          <div key={d.id} className="bg-[#0f1e36]/40 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">{d.name}</p>
              <p className="text-xs text-gray-400">Status: {d.status}</p>
            </div>
            <div className="flex items-center gap-3">
              <Circle className={d.status === "online" ? "text-emerald-400" : "text-red-400"} />
              <button className="bg-white/5 px-3 py-1 rounded-full text-sm text-white/80">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
