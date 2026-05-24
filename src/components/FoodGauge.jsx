export default function FoodGauge({ level }) {
  const percentage = level !== null && level !== undefined ? level : 0;
  const remaining = Math.max(0, 100 - percentage);

  /* Gauge arc calculation */
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (remaining / 100) * circumference;

  /* Color based on remaining level */
  let gaugeColor = "#22c55e"; /* green */
  let bgTint = "bg-emerald-50";
  let statusText = "Adequate";
  let statusColor = "text-emerald-600";
  if (remaining <= 10) {
    gaugeColor = "#ef4444";
    bgTint = "bg-red-50";
    statusText = "Critical!";
    statusColor = "text-red-600";
  } else if (remaining <= 30) {
    gaugeColor = "#f59e0b";
    bgTint = "bg-amber-50";
    statusText = "Running Low";
    statusColor = "text-amber-600";
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <h3 className="text-base font-bold text-gray-800 mb-1">Food Level</h3>
      <p className="text-xs text-gray-400 mb-4">Container monitoring</p>

      {/* Gauge */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-36 h-36">
          <svg
            viewBox="0 0 120 120"
            className="w-full h-full -rotate-90"
          >
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="12"
            />
            {/* Progress arc */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={gaugeColor}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-gray-800">
              {remaining}
              <span className="text-sm font-semibold text-gray-400">%</span>
            </span>
            <span className="text-[10px] text-gray-400 font-medium">
              remaining
            </span>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-1.5 mt-4">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${bgTint} ${statusColor}`}>
            {statusText}
          </span>
        </div>
        <p className="text-[10px] text-gray-400 mt-2 font-mono">
          Raw sensor: {percentage}
        </p>
      </div>
    </div>
  );
}
