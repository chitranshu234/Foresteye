import { FiAlertTriangle } from "react-icons/fi";

export default function FoodRefillAlert({ foodLevel }) {
  return (
    <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl px-5 py-3.5 border border-red-200 flex items-center gap-3 animate-pulse shadow-sm">
      <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
        <FiAlertTriangle className="text-red-500 text-lg" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-red-700">Food Refill Alert</p>
        <p className="text-xs text-red-500">
          Food level critically low at <strong>{foodLevel}%</strong>. Immediate refill required to maintain cattle health.
        </p>
      </div>
      <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full flex-shrink-0">
        {foodLevel}%
      </span>
    </div>
  );
}
