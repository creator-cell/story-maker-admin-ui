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

export default function TemplateChart() {
  const API_URL_TEMPLATE = process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE;
  const [chartData, setChartData] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const pageSize = 10;

  const getTemplate = async (pageNum = 1) => {
    try {
      const response = await axios.get(`${API_URL_TEMPLATE}template`, {
        params: { page: pageNum, pageSize },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const templates = response.data.data || [];
      const total = response.data.total || 0;
      setTotalPages(Math.ceil(total / pageSize));

      const labels = templates.map((t) => t.name);
      const counts = templates.map((t) => t.templateCount);

      setChartData({
        labels,
        datasets: [
          {
            label: "Template Usage Count",
            data: counts,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            maxBarThickness: 20,
          },
        ],
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTemplate(page);
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) setPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage((prev) => prev - 1);
  };

  return (
    <div>
      <div className="box text-center">
        <p>Template Usage Statistics</p>

        <div style={{ height: "300px", width: "95%", margin: "auto" }}>
          {chartData.labels ? (
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
                    barPercentage: 0.5,
                    categoryPercentage: 0.6,
                    ticks: {
                      autoSkip: false,
                      maxRotation: 45,
                      minRotation: 45,
                    },
                  },
                  y: { beginAtZero: true },
                },
              }}
            />
          ) : (
            <p>Loading chart...</p>
          )}
        </div>

        {/* Pagination buttons */}
      </div>
      <div className="mt-3 flex justify-center items-center gap-3">
        <button
          className="btn btn-secondary"
          onClick={handlePrev}
          disabled={page === 1}
        >
          ◀ Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={page === totalPages}
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}
