export default function TotalGauge({ meters = [] }) {
  const total = meters.reduce(
    (sum, m) => sum + (Number(m.Total_Units) || 0),
    0
  );

  const MAX = 500000; // configurable building limit (liters)
  const percent = Math.min((total / MAX) * 100, 100);

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-white/10 backdrop-blur-xl rounded-2xl px-8 py-6 shadow-(--shadow-glow-cyan)">
      <h2 className="text-sm text-center mb-2 tracking-wide text-gray-300">
        Total Consumption
      </h2>

      <div className="relative w-40 h-40 mx-auto">
        <svg className="w-full h-full -rotate-90">
          {/* Background ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="10"
            fill="none"
          />

          {/* Progress ring */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            stroke="rgba(34,211,238,0.9)"
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-700 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]"
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold">
            {total.toLocaleString()}
          </span>
          <span className="text-xs text-gray-400">Liters</span>
        </div>
      </div>
    </div>
  );
}
