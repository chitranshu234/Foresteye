import { useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const chartConfigs = {
  temperature: {
    title: "Temperature History",
    color: "#3b82f6",
    hoverColor: "#2563eb",
    legendItems: [
      { label: "Normal", color: "#93c5fd" },
      { label: "Average", color: "#3b82f6" },
      { label: "High", color: "#1d4ed8" },
    ],
  },
  pressure: {
    title: "Pressure Trend",
    color: "#06b6d4",
    hoverColor: "#0891b2",
    legendItems: [
      { label: "Low", color: "#a5f3fc" },
      { label: "Normal", color: "#06b6d4" },
      { label: "High", color: "#0e7490" },
    ],
  },
  food: {
    title: "Food Level Log",
    color: "#f59e0b",
    hoverColor: "#d97706",
    legendItems: [
      { label: "OK", color: "#fde68a" },
      { label: "Low", color: "#f59e0b" },
      { label: "Critical", color: "#b45309" },
    ],
  },
};

function ChartCard({ type, history }) {
  const chartRef = useRef(null);
  const config = chartConfigs[type];
  if (!config) return null;

  const entries = history.slice(-10);
  const labels = entries.map((e) => e.time?.split(" ")[0] || "");
  const values = entries.map((e) => e.value);

  /* Color each bar individually for visual variety */
  const barColors = values.map((v, i) => {
    const t = i / Math.max(values.length - 1, 1);
    return i === values.length - 1 ? config.hoverColor : config.color;
  });

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: barColors.map((c) => c + "cc"),
        hoverBackgroundColor: barColors,
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.6,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#333",
        bodyColor: "#666",
        borderColor: "#e5e7eb",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
        displayColors: false,
        titleFont: { size: 12, weight: "600", family: "Inter" },
        bodyFont: { size: 11, family: "Inter" },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#aaa", font: { size: 9, family: "Inter" }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        grid: { color: "#f3f4f6" },
        ticks: { color: "#aaa", font: { size: 9, family: "Inter" }, padding: 6 },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-gray-800">{config.title}</h3>

      </div>

      {/* Legend dots */}
      <div className="flex items-center gap-3 mb-4">
        {config.legendItems.map((item) => (
          <div key={item.label} className="flex items-center gap-1">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[10px] text-gray-400">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="h-[180px]">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}

export default function Charts({ history }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <ChartCard type="temperature" history={history.temperature || []} />
      <ChartCard type="pressure" history={history.pressure || []} />
      <ChartCard type="food" history={history.food || []} />
    </div>
  );
}
