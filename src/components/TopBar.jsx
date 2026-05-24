import { useState, useEffect } from "react";
import { FiWifi, FiWifiOff } from "react-icons/fi";

export default function TopBar({ isOnline }) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dayName = time.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = time.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = time.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="flex items-center justify-between px-8 py-4">
      {/* Left — Date */}
      <div>
        <h2 className="text-xl font-extrabold text-gray-800 tracking-tight">
          ForestEye
        </h2>
        <p className="text-xs text-gray-400 font-medium">
          Today is {dayName}, {dateStr} &nbsp;|&nbsp; {timeStr}
        </p>
      </div>



      {/* Right — Controls */}
      <div className="flex items-center gap-3">
        {/* Connection */}
        <div
          className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold border transition-all ${
            isOnline
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {isOnline ? <FiWifi className="text-sm" /> : <FiWifiOff className="text-sm animate-pulse" />}
          <span>{isOnline ? "Online" : "Offline"}</span>
        </div>



        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
          IO
        </div>
      </div>
    </div>
  );
}
