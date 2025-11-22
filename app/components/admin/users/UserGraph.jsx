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
import React from "react";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function UserGrowthChart() {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
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
    <div>
      <p>
        {t("User Growth Over Time")}
      </p>
      
        <form action="">
          <div className="row">
            {/* Date Filters */}
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form_group">
                <label className="d-block mb-2">{t("Start Date:")}</label>
                <input
                  type="date"
                  className="form-control"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-12">
              <div className="form_group">
                <label className="d-block mb-2">{t("End Date:")}</label>
                <input
                  type="date"
                  className="form-control"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="comman-date d-flex align-items-end">
              <button
                onClick={getUserGrowth}
                className="button"
              >
                {t("Show Chart")}
              </button>
            </div>

          </div>
        </form>
     

      {/* Chart */}
      <div className="view-chart mt-4">
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
          <p className="text-center mt-4">
            {t("Select a date range to view user growth.")}
          </p>
        )}
      </div>
    </div>
  );
}
