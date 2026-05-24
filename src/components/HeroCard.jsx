import { 
  WiDaySunny, 
  WiCloudy, 
  WiRain, 
  WiHot, 
  WiSnowflakeCold, 
  WiNightClear, 
  WiNightAltCloudy 
} from "react-icons/wi";
import { FiMapPin } from "react-icons/fi";

function checkIsNight(timeStr) {
  if (timeStr) {
    const match = timeStr.match(/^(\d+):/);
    if (match) {
      const hour = parseInt(match[1], 10);
      const isPM = timeStr.toLowerCase().includes("pm");
      const isAM = timeStr.toLowerCase().includes("am");
      let realHour = hour;
      if (isPM && hour < 12) realHour += 12;
      if (isAM && hour === 12) realHour = 0;
      return realHour < 6 || realHour >= 18;
    }
  }
  const hours = new Date().getHours();
  return hours < 6 || hours >= 18;
}

function getCondition(temp, rain, isNight) {
  if (rain === 0 || rain === "0") return { text: "Rainy", icon: WiRain };
  
  if (isNight) {
    if (temp > 28) return { text: "Warm Night", icon: WiNightAltCloudy };
    return { text: "Clear Night", icon: WiNightClear };
  }
  
  if (temp > 38) return { text: "Hot", icon: WiHot };
  if (temp > 28) return { text: "Warm & Sunny", icon: WiDaySunny };
  if (temp > 18) return { text: "Mild", icon: WiCloudy };
  if (temp > 5) return { text: "Cool", icon: WiCloudy };
  return { text: "Cold", icon: WiSnowflakeCold };
}

export default function HeroCard({ temperature, rain, history }) {
  const isNight = checkIsNight(history?.time || new Date().toLocaleTimeString());
  const condition = getCondition(temperature, rain, isNight);
  const CondIcon = condition.icon;

  /* Compute high / low from history */
  const temps = (history?.temperature || []).map((h) => h.value).filter(Boolean);
  const high = temps.length ? Math.max(...temps).toFixed(1) : temperature;
  const low = temps.length ? Math.min(...temps).toFixed(1) : temperature;

  const roundedTemp = temperature !== null && temperature !== undefined
    ? Math.round(temperature)
    : "--";

  return (
    <div className={`relative h-full min-h-[260px] rounded-3xl overflow-hidden p-6 flex flex-col justify-between text-white transition-all duration-1000 ${
      isNight 
        ? "bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#311042]" 
        : "bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600"
    }`}>
      {/* Decorative cloud shapes (hide slightly at night or dim) */}
      <div className={`absolute top-6 right-10 w-28 h-14 rounded-full blur-xl pointer-events-none transition-opacity duration-1000 ${isNight ? "bg-white/5 opacity-50" : "bg-white/15"}`} />
      <div className={`absolute top-20 right-2 w-20 h-10 rounded-full blur-lg pointer-events-none transition-opacity duration-1000 ${isNight ? "bg-white/5 opacity-50" : "bg-white/10"}`} />
      <div className={`absolute bottom-16 right-24 w-36 h-18 rounded-full blur-2xl pointer-events-none transition-opacity duration-1000 ${isNight ? "bg-white/3 opacity-30" : "bg-white/8"}`} />

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
            {roundedTemp}
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
