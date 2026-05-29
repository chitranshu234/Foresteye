import { FiHeart, FiAlertTriangle, FiCheckCircle, FiThermometer } from "react-icons/fi";
import { GiCow } from "react-icons/gi";
import { MdFastfood } from "react-icons/md";

export default function HealthMonitor({ healthStatus, temperature, cattlePresent, foodLevel }) {
  const isPresent = cattlePresent === 1 || cattlePresent === "1" || cattlePresent === true;
  const status = healthStatus || "Unknown";

  /* Map health_status string from sensor to score/color */
  let scoreColor = "text-emerald-500";
  let scoreBg = "bg-emerald-50";
  let ScoreIcon = FiCheckCircle;

  const statusLower = status.toLowerCase();
  if (statusLower === "critical" || statusLower === "danger") {
    scoreColor = "text-red-500";
    scoreBg = "bg-red-50";
    ScoreIcon = FiAlertTriangle;
  } else if (statusLower === "warning" || statusLower === "moderate" || statusLower === "caution") {
    scoreColor = "text-amber-500";
    scoreBg = "bg-amber-50";
    ScoreIcon = FiAlertTriangle;
  } else if (statusLower === "good" || statusLower === "normal" || statusLower === "healthy") {
    scoreColor = "text-emerald-500";
    scoreBg = "bg-emerald-50";
    ScoreIcon = FiCheckCircle;
  }

  const factors = [
    {
      label: "Temperature",
      value: `${temperature}°C`,
      ok: temperature >= 10 && temperature <= 38,
      icon: FiThermometer,
    },
    {
      label: "Food Level",
      value: `${foodLevel}%`,
      ok: foodLevel >= 20,
      icon: MdFastfood,
    },
    {
      label: "Cattle Activity",
      value: isPresent ? "Active" : "Inactive",
      ok: isPresent,
      icon: GiCow,
    },
  ];

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl border border-green-100 shadow-sm h-full flex flex-col p-5">
      <h3 className="text-sm font-bold text-green-900 mb-1">Health Monitoring</h3>
      <p className="text-xs text-emerald-400 mb-4">Sensor-reported health status</p>

      {/* Status circle */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className={`w-24 h-24 rounded-full ${scoreBg} flex flex-col items-center justify-center mb-3 border-2 border-current ${scoreColor}`}>
          <ScoreIcon className={`text-2xl mb-1 ${scoreColor}`} />
          <span className={`text-[11px] font-bold uppercase tracking-wider ${scoreColor}`}>{status}</span>
        </div>

        <div className="flex items-center gap-1 mb-4">
          <FiHeart className={`text-sm ${scoreColor}`} />
          <span className={`text-xs font-semibold ${scoreColor}`}>Health Status</span>
        </div>

        {/* Contributing factors */}
        <div className="w-full space-y-2">
          {factors.map((f) => {
            const FIcon = f.icon;
            return (
              <div key={f.label} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span className={`w-1.5 h-1.5 rounded-full ${f.ok ? "bg-emerald-400" : "bg-red-400"}`} />
                  <span className="text-[11px] text-emerald-600">{f.label}</span>
                </div>
                <span className={`text-[11px] font-semibold ${f.ok ? "text-green-700" : "text-red-600"}`}>{f.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
