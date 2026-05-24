import { useState } from "react";
import { 
  WiThermometer, 
  WiBarometer,
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiHot,
  WiSnowflakeCold 
} from "react-icons/wi";
import { IoFastFood } from "react-icons/io5";
import { FiAlertTriangle, FiCheck, FiCpu } from "react-icons/fi";

const tabs = [
  { id: "temperature", label: "Temperature", icon: WiThermometer, unit: "°C", color: "#e76f51" },
  { id: "pressure", label: "Pressure", icon: WiBarometer, unit: "hPa", color: "#457b9d" },
  { id: "food", label: "Food Level", icon: IoFastFood, unit: "%", color: "#e9c46a" },
];

function getReadingIconInfo(type, value) {
  if (type === "temperature") {
    if (value > 35) {
      return { icon: WiHot, bgClass: "bg-red-50 text-red-500 border-red-100" };
    }
    if (value > 25) {
      return { icon: WiDaySunny, bgClass: "bg-amber-50 text-amber-500 border-amber-100" };
    }
    if (value > 15) {
      return { icon: WiCloudy, bgClass: "bg-blue-50 text-blue-400 border-blue-100" };
    }
    return { icon: WiSnowflakeCold, bgClass: "bg-sky-50 text-sky-400 border-sky-100" };
  }

  if (type === "pressure") {
    if (value > 1013) {
      return { icon: WiDaySunny, bgClass: "bg-amber-50 text-amber-500 border-amber-100" };
    }
    return { icon: WiRain, bgClass: "bg-blue-50 text-blue-500 border-blue-100" };
  }

  if (type === "food") {
    if (value > 70) {
      return { icon: FiAlertTriangle, bgClass: "bg-red-50 text-red-500 border-red-100" };
    }
    if (value > 40) {
      return { icon: IoFastFood, bgClass: "bg-amber-50 text-amber-500 border-amber-100" };
    }
    return { icon: FiCheck, bgClass: "bg-emerald-50 text-emerald-500 border-emerald-100" };
  }

  return { icon: FiCpu, bgClass: "bg-gray-50 text-gray-500 border-gray-100" };
}

export default function RecentReadings({ history }) {
  const [activeTab, setActiveTab] = useState("temperature");
  const tab = tabs.find((t) => t.id === activeTab);
  const data = history[activeTab] || [];

  /* Show last 6 entries */
  const entries = data.slice(-6);
  const currentIdx = entries.length - 1;

  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-gray-800">Sensor Timeline</h3>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === t.id
                ? "bg-gray-800 text-white"
                : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Cards strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 flex-1 items-stretch">
        {entries.map((entry, i) => {
          const isCurrent = i === currentIdx;
          const iconInfo = getReadingIconInfo(activeTab, entry.value);
          const Icon = iconInfo.icon;
          
          return (
            <div
              key={i}
              className={`flex-shrink-0 w-[88px] rounded-2xl flex flex-col items-center justify-center gap-2 py-4 px-3 border-2 transition-all ${
                isCurrent
                  ? "bg-sky-50 border-sky-400"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <span className="text-[10px] font-semibold text-gray-400 uppercase">
                {i === currentIdx ? "Now" : entry.time?.split(" ")[0] || `T-${currentIdx - i}`}
              </span>
              
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border ${iconInfo.bgClass}`}>
                <Icon className="text-lg" />
              </div>

              <span
                className="text-sm font-bold mt-1"
                style={{ color: isCurrent ? tab.color : "#374151" }}
              >
                {entry.value}
                <span className="text-[10px] font-normal ml-0.5 text-gray-400">
                  {tab.unit}
                </span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
