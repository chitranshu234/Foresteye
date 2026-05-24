import { WiDaySunny, WiCloudy, WiRain, WiHot, WiSnowflakeCold } from "react-icons/wi";
import { FiMapPin } from "react-icons/fi";

function getCondition(temp, rain) {
  if (rain === 0 || rain === "0") return { text: "Rainy", icon: WiRain };
  if (temp > 38) return { text: "Hot", icon: WiHot };
  if (temp > 28) return { text: "Warm & Sunny", icon: WiDaySunny };
  if (temp > 18) return { text: "Mild", icon: WiCloudy };
  if (temp > 5) return { text: "Cool", icon: WiCloudy };
  return { text: "Cold", icon: WiSnowflakeCold };
}

export default function HeroCard({ temperature, rain, history }) {
  const condition = getCondition(temperature, rain);
  const CondIcon = condition.icon;

  /* Compute high / low from history */
  const temps = (history?.temperature || []).map((h) => h.value).filter(Boolean);
  const high = temps.length ? Math.max(...temps).toFixed(1) : temperature;
  const low = temps.length ? Math.min(...temps).toFixed(1) : temperature;

  return (
    <div className="relative h-full min-h-[260px] rounded-3xl overflow-hidden bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 p-6 flex flex-col justify-between text-white">
      {/* Decorative cloud shapes */}
      <div className="absolute top-6 right-10 w-28 h-14 bg-white/15 rounded-full blur-xl pointer-events-none" />
      <div className="absolute top-20 right-2 w-20 h-10 bg-white/10 rounded-full blur-lg pointer-events-none" />
      <div className="absolute bottom-16 right-24 w-36 h-18 bg-white/8 rounded-full blur-2xl pointer-events-none" />

      {/* Landscape wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 400 60" className="w-full h-12 opacity-20" preserveAspectRatio="none">
          <path
            d="M0,35 C60,15 120,45 200,25 C280,5 340,40 400,20 L400,60 L0,60 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Top row */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
          <FiMapPin className="text-xs" />
          Sensor Station
        </div>
        <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
          °C
        </div>
      </div>

      {/* Temperature */}
      <div className="relative z-10 mt-2">
        <div className="flex items-start gap-1">
          <span className="text-7xl font-extrabold leading-none tracking-tighter">
            {temperature !== null && temperature !== undefined
              ? Math.round(temperature)
              : "--"}
          </span>
          <span className="text-3xl font-light mt-1">°C</span>
        </div>
      </div>

      {/* Condition + range */}
      <div className="relative z-10 flex items-end justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <CondIcon className="text-2xl" />
            <span className="text-base font-semibold">{condition.text}</span>
          </div>
          <p className="text-xs text-white/70">
            High: {high}° &nbsp; Low: {low}°
          </p>
        </div>
      </div>
    </div>
  );
}
