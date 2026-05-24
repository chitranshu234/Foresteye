import { useState, useEffect, useCallback } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";

import TopBar from "../components/TopBar";
import HeroCard from "../components/HeroCard";
import RecentReadings from "../components/RecentReadings";
import FoodGauge from "../components/FoodGauge";
import Charts from "../components/Charts";

import { WiBarometer, WiRain, WiDaySunny } from "react-icons/wi";
import { TbMountain } from "react-icons/tb";
import { FiCheckCircle, FiClock, FiCpu, FiActivity } from "react-icons/fi";

/* ─────────── Dummy Data ─────────── */
const DUMMY_SENSOR = {
  temperature: 34.5,
  pressure: 977,
  rain: 1,
  food: 35,
  altitude: 305,
  time: "12:24",
};

function generateDummyHistory() {
  const now = new Date();
  const h = { temperature: [], pressure: [], food: [] };
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now - i * 5 * 60000);
    const ts = t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    h.temperature.push({ time: ts, value: +(32 + Math.random() * 5).toFixed(1) });
    h.pressure.push({ time: ts, value: +(970 + Math.random() * 15).toFixed(0) });
    h.food.push({ time: ts, value: +(20 + Math.random() * 30).toFixed(0) });
  }
  return h;
}

const MAX_HISTORY = 20;
const OFFLINE_TIMEOUT = 60000;

/* ─────────── Info Cards Config ─────────── */
const InfoCard = ({ icon: Icon, iconColor, label, value, unit, description }) => (
  <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-1">
    <Icon className="text-2xl mb-1" style={{ color: iconColor }} />
    <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400">
      {label}
    </span>
    <div className="flex items-baseline gap-1">
      <span className="text-xl font-extrabold text-gray-800">{value}</span>
      {unit && <span className="text-xs font-medium text-gray-400">{unit}</span>}
    </div>
    <span className="text-[10px] text-gray-400">{description}</span>
  </div>
);

/* ─────────── Dashboard ─────────── */
export default function Dashboard() {
  const [sensorData, setSensorData] = useState(DUMMY_SENSOR);
  const [history, setHistory] = useState(generateDummyHistory);
  const [alerts, setAlerts] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isOnline, setIsOnline] = useState(true);
  const [useFirebase, setUseFirebase] = useState(false);

  /* ── Alert logic ── */
  const computeAlerts = useCallback((data) => {
    const a = [];
    if (data.rain === 0 || data.rain === "0") a.push({ type: "rain" });
    if (data.food > 90) a.push({ type: "foodEmpty" });
    if (data.temperature > 85) a.push({ type: "sensorError" });
    return a;
  }, []);

  /* ── Push history ── */
  const pushHistory = useCallback((data) => {
    const ts = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setHistory((prev) => ({
      temperature: [...prev.temperature, { time: ts, value: data.temperature }].slice(-MAX_HISTORY),
      pressure: [...prev.pressure, { time: ts, value: data.pressure }].slice(-MAX_HISTORY),
      food: [...prev.food, { time: ts, value: data.food }].slice(-MAX_HISTORY),
    }));
  }, []);

  /* ── Firebase listener ── */
  useEffect(() => {
    let unsubscribe;
    try {
      const sensorRef = ref(database, "sensorData");
      unsubscribe = onValue(
        sensorRef,
        (snapshot) => {
          const data = snapshot.val();
          if (data) {
            setUseFirebase(true);
            setSensorData(data);
            setLastUpdate(Date.now());
            setIsOnline(true);
            setAlerts(computeAlerts(data));
            pushHistory(data);
          }
        },
        (error) => {
          console.warn("Firebase read failed:", error);
        }
      );
    } catch (err) {
      console.warn("Firebase init failed:", err);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [computeAlerts, pushHistory]);

  /* ── Offline detection ── */
  useEffect(() => {
    const iv = setInterval(() => {
      if (Date.now() - lastUpdate > OFFLINE_TIMEOUT && useFirebase) {
        setIsOnline(false);
      }
    }, 10000);
    return () => clearInterval(iv);
  }, [lastUpdate, useFirebase]);

  /* ── Alerts for dummy mode ── */
  useEffect(() => {
    if (!useFirebase && sensorData) setAlerts(computeAlerts(sensorData));
  }, [sensorData, useFirebase, computeAlerts]);

  /* ── Computed values ── */
  const rainText = sensorData.rain === 0 || sensorData.rain === "0" ? "Raining" : "Clear";
  const rainDesc = sensorData.rain === 0 || sensorData.rain === "0" ? "Sensor wet" : "No precipitation";
  const timeSince = () => {
    const diff = Math.floor((Date.now() - lastUpdate) / 1000);
    if (diff < 60) return `${diff}s ago`;
    return `${Math.floor(diff / 60)}m ago`;
  };

  /* ── Info cards data ── */
  const infoCards = [
    {
      icon: WiBarometer,
      iconColor: "#457b9d",
      label: "Pressure",
      value: sensorData.pressure,
      unit: "hPa",
      description: "Atmospheric pressure",
    },
    {
      icon: TbMountain,
      iconColor: "#16a34a",
      label: "Altitude",
      value: sensorData.altitude,
      unit: "m",
      description: "Station elevation",
    },
    {
      icon: sensorData.rain === 0 || sensorData.rain === "0" ? WiRain : WiDaySunny,
      iconColor: sensorData.rain === 0 || sensorData.rain === "0" ? "#3b82f6" : "#f59e0b",
      label: "Rain Status",
      value: rainText,
      unit: "",
      description: rainDesc,
    },
    {
      icon: FiCpu,
      iconColor: "#8b5cf6",
      label: "Sensors",
      value: "4/4",
      unit: "",
      description: "All operational",
    },
    {
      icon: FiActivity,
      iconColor: "#22c55e",
      label: "System",
      value: useFirebase ? "Live" : "Demo",
      unit: "",
      description: useFirebase ? "Firebase connected" : "Using dummy data",
    },
    {
      icon: FiClock,
      iconColor: "#6366f1",
      label: "Last Update",
      value: timeSince(),
      unit: "",
      description: "Real-time data",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Main content */}
      <div className="w-full">
        <TopBar isOnline={isOnline} />

        <main className="px-6 pb-8 space-y-5">
          {/* ── Row 1: Hero + Recent Readings ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5">
              <HeroCard
                temperature={sensorData.temperature}
                rain={sensorData.rain}
                history={history}
              />
            </div>
            <div className="lg:col-span-7">
              <RecentReadings history={history} />
            </div>
          </div>

          {/* ── Row 2: Info Cards + Food Gauge + Status Panel ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Info grid — 2×3 */}
            <div className="lg:col-span-5">
              <div className="grid grid-cols-3 gap-3">
                {infoCards.map((card, i) => (
                  <InfoCard key={i} {...card} />
                ))}
              </div>
            </div>

            {/* Food Gauge */}
            <div className="lg:col-span-4">
              <FoodGauge level={sensorData.food} />
            </div>

            {/* Status / Map placeholder */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm h-full overflow-hidden flex flex-col">
                <div className="p-5 pb-3">
                  <h3 className="text-sm font-bold text-gray-800">Sensor Status</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Real-time overview</p>
                </div>
                <div className="flex-1 flex flex-col justify-center px-5 pb-5 gap-3">
                  {/* Mini status items */}
                  <StatusItem label="Temperature" value={`${sensorData.temperature}°C`} ok />
                  <StatusItem label="Pressure" value={`${sensorData.pressure} hPa`} ok />
                  <StatusItem label="Rain" value={rainText} ok={sensorData.rain !== 0 && sensorData.rain !== "0"} />
                  <StatusItem label="Food" value={`${Math.max(0, 100 - sensorData.food)}%`} ok={sensorData.food <= 70} />

                  {/* Footer badge */}
                  <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                      useFirebase
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${useFirebase ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                      {useFirebase ? "Firebase Live" : "Demo Mode"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Row 3: Charts ── */}
          <Charts history={history} />
        </main>
      </div>
    </div>
  );
}

/* ── Mini status row item ── */
function StatusItem({ label, value, ok }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${ok ? "bg-emerald-400" : "bg-red-400"}`} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <span className="text-xs font-semibold text-gray-700">{value}</span>
    </div>
  );
}
