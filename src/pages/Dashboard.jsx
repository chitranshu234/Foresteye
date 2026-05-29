import { useState, useEffect, useCallback } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase/firebase";
import { FiThermometer, FiChevronsUp, FiRadio } from "react-icons/fi";
import { WiBarometer } from "react-icons/wi";

import TopBar from "../components/TopBar";
import CattlePresenceCard from "../components/CattlePresenceCard";
import FoodGauge from "../components/FoodGauge";
import HealthMonitor from "../components/HealthMonitor";
import StatsCards from "../components/StatsCards";
import Charts from "../components/Charts";
import FoodRefillAlert from "../components/FoodRefillAlert";

/* ─────────── Dummy Data ─────────── */
const DUMMY_SENSOR = {
  temperature: 34.5,
  pressure: 977,
  altitude: 305,
  food_level: 35,
  cattle_present: 1,
  health_status: "Normal",
  visit_count: 7,
  feeding_duration: 720,       // seconds (from feedingDurationMs / 1000)
  object_distance: 45,         // cm (ultrasonic)
  timestamp: "2025-05-30 01:00:00",
};

function generateDummyHistory() {
  const now = new Date();
  const h = { food_level: [], temperature: [], visitLog: [] };
  for (let i = 11; i >= 0; i--) {
    const t = new Date(now - i * 5 * 60000);
    const ts = t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    h.food_level.push({ time: ts, value: +(60 - i * 3 + Math.random() * 5).toFixed(0) });
    h.temperature.push({ time: ts, value: +(32 + Math.random() * 5).toFixed(1) });
    h.visitLog.push({ time: ts, value: Math.floor(Math.random() * 3) });
  }
  return h;
}

const MAX_HISTORY = 20;
const OFFLINE_TIMEOUT = 10000;

/* ─────────── Dashboard ─────────── */
export default function Dashboard() {
  const [sensorData, setSensorData] = useState(DUMMY_SENSOR);
  const [history, setHistory] = useState(generateDummyHistory);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [isOnline, setIsOnline] = useState(false);
  const [useFirebase, setUseFirebase] = useState(false);

  /* ── Push history ── */
  const pushHistory = useCallback((data) => {
    const ts = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setHistory((prev) => ({
      food_level: [...prev.food_level, { time: ts, value: data.food_level }].slice(-MAX_HISTORY),
      temperature: [...prev.temperature, { time: ts, value: data.temperature }].slice(-MAX_HISTORY),
      visitLog: [...prev.visitLog, { time: ts, value: data.cattle_present ? 1 : 0 }].slice(-MAX_HISTORY),
    }));
  }, []);

  /* ── Firebase listener ── */
  useEffect(() => {
    let unsubscribe;
    try {
      const sensorRef = ref(database, "readings/latest");
      unsubscribe = onValue(
        sensorRef,
        (snapshot) => {
          const raw = snapshot.val();
          if (raw) {
            const data = {
              // Environmental
              temperature:      raw.temperature !== undefined ? parseFloat(raw.temperature) : 0,
              pressure:         raw.pressure !== undefined ? Math.round(parseFloat(raw.pressure)) : 0,
              altitude:         raw.altitude !== undefined ? Math.round(parseFloat(raw.altitude)) : 0,
              // Cattle
              food_level:       raw.food_level !== undefined ? parseInt(raw.food_level) : 0,
              cattle_present:   raw.cattle_present !== undefined ? parseInt(raw.cattle_present) : 0,
              health_status:    raw.health_status !== undefined ? String(raw.health_status) : "Unknown",
              // System / Tracking
              visit_count:      raw.visit_count !== undefined ? parseInt(raw.visit_count) : 0,
              feeding_duration: raw.feeding_duration !== undefined ? parseInt(raw.feeding_duration) : 0,
              object_distance:  raw.object_distance !== undefined ? parseFloat(raw.object_distance) : 0,
              timestamp:        raw.timestamp || "",
            };
            setUseFirebase(true);
            setSensorData(data);
            setLastUpdate(Date.now());
            setIsOnline(true);
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
  }, [pushHistory]);

  /* ── Offline detection ── */
  useEffect(() => {
    const iv = setInterval(() => {
      if (Date.now() - lastUpdate > OFFLINE_TIMEOUT && useFirebase) {
        setIsOnline(false);
      }
    }, 2000);
    return () => clearInterval(iv);
  }, [lastUpdate, useFirebase]);

  /* ── Computed ── */
  const needsRefill = sensorData.food_level < 20;

  return (
    <div className="min-h-screen">
      <div className="w-full">
        <TopBar isOnline={isOnline && useFirebase} useFirebase={useFirebase} />

        <main className="px-6 pb-8 space-y-5">

          {/* ── Food Refill Alert Banner ── */}
          {needsRefill && <FoodRefillAlert foodLevel={sensorData.food_level} />}

          {/* ── Row 1: Cattle Presence + Stats Cards ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-5">
              <CattlePresenceCard
                cattlePresent={sensorData.cattle_present}
                feedingDuration={sensorData.feeding_duration}
                visitCount={sensorData.visit_count}
                objectDistance={sensorData.object_distance}
              />
            </div>
            <div className="lg:col-span-7">
              <StatsCards
                sensorData={sensorData}
                useFirebase={useFirebase}
                lastUpdate={lastUpdate}
                isOnline={isOnline && useFirebase}
              />
            </div>
          </div>

          {/* ── Row 2: Food Gauge + Health Monitor + Environmental ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-4">
              <FoodGauge level={sensorData.food_level} />
            </div>
            <div className="lg:col-span-4">
              <HealthMonitor
                healthStatus={sensorData.health_status}
                temperature={sensorData.temperature}
                cattlePresent={sensorData.cattle_present}
                foodLevel={sensorData.food_level}
              />
            </div>
            <div className="lg:col-span-4">
              <EnvironmentPanel
                temperature={sensorData.temperature}
                pressure={sensorData.pressure}
                altitude={sensorData.altitude}
                objectDistance={sensorData.object_distance}
                timestamp={sensorData.timestamp}
              />
            </div>
          </div>

          {/* ── Row 3: Charts ── */}
          <Charts history={history} />
        </main>
      </div>
    </div>
  );
}

/* ─── Environmental Monitoring Panel ─── */
function EnvironmentPanel({ temperature, pressure, altitude, objectDistance, timestamp }) {
  const items = [
    { label: "Temperature", value: `${temperature}°C`, icon: FiThermometer, iconColor: "text-red-500", iconBg: "bg-red-50" },
    { label: "Pressure", value: `${pressure} hPa`, icon: WiBarometer, iconColor: "text-blue-500", iconBg: "bg-blue-50" },
    { label: "Altitude", value: `${altitude} m`, icon: FiChevronsUp, iconColor: "text-green-600", iconBg: "bg-green-50" },
    { label: "Object Distance", value: `${objectDistance} cm`, icon: FiRadio, iconColor: "text-indigo-500", iconBg: "bg-indigo-50" },
  ];

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl border border-green-100 shadow-sm h-full flex flex-col p-5">
      <h3 className="text-sm font-bold text-green-900 mb-1">Environmental Monitoring</h3>
      <p className="text-xs text-emerald-400 mb-4">Station conditions</p>
      <div className="flex-1 flex flex-col justify-center gap-3">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2.5">
                <div className={`w-7 h-7 rounded-lg ${item.iconBg} flex items-center justify-center`}>
                  <Icon className={`text-base ${item.iconColor}`} />
                </div>
                <span className="text-xs text-emerald-600">{item.label}</span>
              </div>
              <span className="text-xs font-bold text-green-800">{item.value}</span>
            </div>
          );
        })}
      </div>
      {/* Timestamp footer */}
      {timestamp && (
        <div className="mt-3 pt-3 border-t border-green-100 text-center">
          <span className="text-[10px] text-emerald-400 font-mono">{timestamp}</span>
        </div>
      )}
    </div>
  );
}
