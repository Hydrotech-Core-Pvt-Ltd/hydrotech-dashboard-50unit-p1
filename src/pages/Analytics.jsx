import { BarChart2, Calendar } from "lucide-react";

export default function Analytics() {
  const monthly = [
    { month: "Jan", value: 420 },
    { month: "Feb", value: 380 },
    { month: "Mar", value: 450 },
    { month: "Apr", value: 500 },
    { month: "May", value: 460 },
    { month: "Jun", value: 520 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Analytics</h1>
          <p className="text-gray-400 text-sm">Simple usage stats and trends (dummy data)</p>
        </div>
        <div className="text-white/60 flex items-center gap-3">
          <Calendar size={18} />
          <span className="text-sm">Last 6 months</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#0f1e36]/40 rounded-2xl p-6 border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-400 text-sm">Monthly Consumption</p>
            <BarChart2 className="text-cyan-300" />
          </div>
          <div className="flex gap-3 items-end">
            {monthly.map((m) => (
              <div key={m.month} className="flex flex-col items-center">
                <div style={{ height: `${m.value / 6}px` }} className="w-8 bg-cyan-400 rounded-t-md"></div>
                <span className="text-xs text-gray-400 mt-2">{m.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0f1e36]/40 rounded-2xl p-6 border border-white/10">
          <p className="text-gray-400 text-sm mb-3">Top Units (by consumption)</p>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-white">Unit 12B</span>
              <span className="text-gray-400">120 M³</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white">Unit 03A</span>
              <span className="text-gray-400">98 M³</span>
            </li>
            <li className="flex justify-between">
              <span className="text-white">Unit 21C</span>
              <span className="text-gray-400">87 M³</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
