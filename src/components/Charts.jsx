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
import { Bar, Line } from "react-chartjs-2";

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

/* ─── Food Consumption Trend (Line Chart) ─── */
function FoodTrendChart({ history }) {
  const chartRef = useRef(null);
  const entries = history.slice(-12);
  const labels = entries.map((e) => e.time?.split(" ")[0] || "");
  const values = entries.map((e) => e.value);

  const data = {
    labels,
    datasets: [
      {
        label: "Food Level %",
        data: values,
        borderColor: "#16a34a",
        backgroundColor: "rgba(22, 163, 74, 0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#16a34a",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#15803d",
        bodyColor: "#166534",
        borderColor: "#bbf7d0",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
        displayColors: false,
        titleFont: { size: 12, weight: "600", family: "Inter" },
        bodyFont: { size: 11, family: "Inter" },
        callbacks: {
          label: (ctx) => `Food Level: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6ee7b7", font: { size: 9, family: "Inter" }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        min: 0,
        max: 100,
        grid: { color: "#d1fae5" },
        ticks: { color: "#6ee7b7", font: { size: 9, family: "Inter" }, padding: 6, callback: (v) => v + "%" },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-green-100 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-green-900">Food Consumption Trend</h3>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-emerald-500">Food Level Over Time</span>
        </div>
      </div>
      <div className="h-[180px]">
        <Line ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}

/* ─── Environmental Trends (Bar Chart) ─── */
function EnvironmentChart({ history }) {
  const chartRef = useRef(null);
  const entries = history.slice(-10);
  const labels = entries.map((e) => e.time?.split(" ")[0] || "");
  const values = entries.map((e) => e.value);

  const barColors = values.map((v, i) =>
    i === values.length - 1 ? "#22c55e" : "#16a34a"
  );

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
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#15803d",
        bodyColor: "#166534",
        borderColor: "#bbf7d0",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
        displayColors: false,
        titleFont: { size: 12, weight: "600", family: "Inter" },
        bodyFont: { size: 11, family: "Inter" },
        callbacks: {
          label: (ctx) => `Temperature: ${ctx.parsed.y}°C`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6ee7b7", font: { size: 9, family: "Inter" }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        grid: { color: "#d1fae5" },
        ticks: { color: "#6ee7b7", font: { size: 9, family: "Inter" }, padding: 6 },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-green-100 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-green-900">Temperature History</h3>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-[10px] text-emerald-500">Ambient Temperature</span>
        </div>
      </div>
      <div className="h-[180px]">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}

/* ─── Visit Activity Chart (Bar) ─── */
function VisitChart({ history }) {
  const chartRef = useRef(null);
  const entries = history.slice(-12);
  const labels = entries.map((e) => e.time?.split(" ")[0] || "");
  const values = entries.map((e) => e.value);

  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: values.map((v) => (v > 0 ? "#10b981cc" : "#d1fae5cc")),
        hoverBackgroundColor: values.map((v) => (v > 0 ? "#059669" : "#a7f3d0")),
        borderRadius: 6,
        borderSkipped: false,
        barPercentage: 0.5,
        categoryPercentage: 0.7,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#fff",
        titleColor: "#15803d",
        bodyColor: "#166534",
        borderColor: "#bbf7d0",
        borderWidth: 1,
        cornerRadius: 10,
        padding: 10,
        displayColors: false,
        titleFont: { size: 12, weight: "600", family: "Inter" },
        bodyFont: { size: 11, family: "Inter" },
        callbacks: {
          label: (ctx) => `Visits: ${ctx.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#6ee7b7", font: { size: 9, family: "Inter" }, maxRotation: 0 },
        border: { display: false },
      },
      y: {
        grid: { color: "#d1fae5" },
        ticks: {
          color: "#6ee7b7",
          font: { size: 9, family: "Inter" },
          padding: 6,
          stepSize: 1,
        },
        border: { display: false },
      },
    },
  };

  return (
    <div className="bg-white/75 backdrop-blur-md rounded-3xl p-5 border border-green-100 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-green-900">Visit Activity</h3>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-[10px] text-emerald-500">Cattle visits per interval</span>
        </div>
      </div>
      <div className="h-[180px]">
        <Bar ref={chartRef} data={data} options={options} />
      </div>
    </div>
  );
}

/* ─── Charts Layout ─── */
export default function Charts({ history }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <FoodTrendChart history={history.food_level || []} />
      <EnvironmentChart history={history.temperature || []} />
      <VisitChart history={history.visitLog || []} />
    </div>
  );
}
