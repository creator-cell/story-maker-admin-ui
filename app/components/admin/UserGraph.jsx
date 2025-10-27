import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserGrowthChart() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_DASHBOARD;
  const [chartData, setChartData] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const getUserGrowth = async () => {
    if (!startDate || !endDate) return;

    try {
      const response = await axios.get(
        `${API_URL}dashboard/user-growth?startDate=${startDate}&endDate=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const users = response.data?.data || [];
      const labels = users.map((u) => u.date);
      const counts = users.map((u) => u.count);

      setChartData({
        labels,
        datasets: [
          {
            label: "New Users",
            data: counts,
            backgroundColor: "rgba(54, 162, 235, 0.6)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error loading user growth:", error);
    }
  };

  useEffect(() => {
    if (startDate && endDate) getUserGrowth();
  }, [startDate, endDate]);

  return (
    <div className="p-4">
      <h3 className="text-center mb-4 font-semibold text-lg">
        User Growth Over Time
      </h3>

      {/* Date Filters */}
      <div className="flex justify-center gap-4 mb-6">
        <div>
          <label className="block mb-1 text-sm font-medium">Start Date</label>
          <input
            type="date"
            className="border rounded px-3 py-1"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1 text-sm font-medium">End Date</label>
          <input
            type="date"
            className="border rounded px-3 py-1"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <button
          onClick={getUserGrowth}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Show Chart
        </button>
      </div>

      {/* Chart */}
      <div style={{ height: "400px", width: "100%" }}>
        {chartData ? (
          <Bar
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "top" },
                title: { display: false },
              },
              scales: {
                x: {
                  ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
                },
                y: { beginAtZero: true, ticks: { stepSize: 10 } }, // shows 10, 20, 30, etc.
              },
            }}
          />
        ) : (
          <p className="text-center text-gray-500 mt-16">
            Select a date range to view user growth.
          </p>
        )}
      </div>
    </div>
  );
}
