export default function WaveSparkline({ data = [], className = "w-full h-16", height = 40 }) {
  // Fallback demo data if Firebase hasn't sent history yet
  const values = data.length ? data : [8.5, 9.2, 7.8, 10.1, 8.9, 11.3, 9.5, 10.8, 8.2, 9.6];

  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;

  const points = values
    .map((v, i) => {
      const x = (i / Math.max(values.length - 1, 1)) * 100;
      const y = height - ((v - min) / range) * (height - 5);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox={`0 0 100 ${height}`} className={className} preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke="rgba(52,211,153,0.8)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}
