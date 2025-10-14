"use client";
import $ from "jquery";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";
import { useEffect, useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import TemplatePreview from "./TemplatePreview";
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
import TemplateChart from "./TemplateGraph";
export default function AnalyticDashboard({ lang = "en" }) {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_DASHBOARD;
  const API_URL_TEMPLATE = process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE;
  const [activeUser, setActiveUser] = useState("");
  const [templateCount, setTemplateCount] = useState("");
  const [templates, setTemplates] = useState([]);
  const [chartData, setChartData] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [topTemplate, setTopTemplate] = useState();
  useEffect(() => {
    const slider = $(".autoplay");
    if (slider.hasClass("slick-initialized")) {
      slider.slick("unslick");
    }
    slider.slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
      dots: true,
      rtl: lang === "ar",
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }, [lang]);

  const getUserCount = async () => {
    try {
      const response = await axios.get(`${API_URL}dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setActiveUser(response.data.data.activeUsers);
    } catch (err) {
      console.log(err);
    }
  };

  const getTemplateCount = async () => {
    try {
      const response = await axios.get(`${API_URL}dashboard/templateCount`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setTemplateCount(response.data.data.templateCount);
    } catch (err) {
      console.log(err);
    }
  };

  const getTemplate = async (pageNum = 1) => {
    try {
      const response = await axios.get(`${API_URL_TEMPLATE}template`, {
        params: { page: pageNum, pageSize: 10 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const newData = response.data.data || [];
      const totalPages = response.data.totalPages || 1;

      setTemplates((prev) => [...prev, ...newData]);
      setHasMore(pageNum < totalPages);
      console.log(pageNum < totalPages);
      updateChartData([...templates, ...newData]);
    } catch (err) {
      console.log(err);
    }
  };

  const getTopTemplate = async (pageNum = 1) => {
    try {
      const response = await axios.get(
        `${API_URL_TEMPLATE}template/getTopTemplate`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newData = response.data.data || [];

      setTopTemplate(newData);
    } catch (err) {
      console.log(err);
    }
  };

  const updateChartData = (data) => {
    const labels = data.map((t) => t.name);
    const counts = data.map((t) => t.templateCount);

    setChartData({
      labels,
      datasets: [
        {
          label: "Template Usage Count",
          data: counts,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    });
  };

  const handleShowMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    getTemplate(nextPage);
  };

  useEffect(() => {
    getUserCount();
    getTemplateCount();
    getTemplate();
    getTopTemplate();
  }, []);
  return (
    <>
      <div id="main_container">
        <div className="inner_container">
          <div className="container p-0">
            <div id="user" className="comman_admin_layout">
              <div className="container p-0">
                <div className="row">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="title_head">
                      <h1>{t("Analytic Dashboard")}</h1>
                    </div>
                  </div>
                </div>
                <div className="analytic-dashboard">
                  <div className="row dashboard-content">
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="box justify-content-center align-items-center">
                        <div className="icon">
                          <img
                            src="/images/active-user.png"
                            alt="active-user"
                          />
                        </div>
                        <div className="">
                          <p>Active Users</p>
                          <h3>{activeUser}</h3>
                          <span>Total active users this month </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="box justify-content-center align-items-center">
                        <div className="icon">
                          <img
                            src="/images/design-create.png"
                            alt="active-user"
                          />
                        </div>
                        <div className="">
                          <p>Designs Created</p>
                          <h2>{templateCount}</h2>
                          <span>Total designs made by users</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-4 col-12">
                      <div className="box justify-content-center align-items-center">
                        <div className="icon">
                          <img
                            src="/images/use-template.png"
                            alt="active-user"
                          />
                        </div>
                        {/* <div className="">
                          <p>Templates Used</p>
                          <span>Number of templates applied</span>
                        </div> */}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytic-dashboard">
                  <div className="row dashboard-content">
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="box">
                        <p>User growth over time</p>
                      </div>
                    </div>
                    <div className="col-lg-6 col-md-6 col-12">
                      <div className="box">
                        <p>Template Used</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytic-dashboard">
                  <div className="row dashboard-content">
                    <div className="col-lg-12 col-md-12 col-12">
                      <p>Template Used</p>
                      <TemplateChart />
                    </div>
                  </div>
                </div>
                <div
                  className="analytic-dashboard"
                  dir={lang === "ar" ? "rtl" : "ltr"}
                >
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-12 chart">
                      <p>Top used templates and assets</p>
                      <div className="slider autoplay">
                        {topTemplate?.map((template) => (
                          <div key={template._id} className="boxes">
                            <TemplatePreview content={template.content} />
                            <p>{template.name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
