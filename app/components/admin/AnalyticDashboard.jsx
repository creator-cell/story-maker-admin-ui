"use client";
import $ from "jquery";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel";
import { useEffect, useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";

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

import "react-datepicker/dist/react-datepicker.css";

import TemplateChart from "./TemplateGraph";
import UserGrowthChart from "./UserGraph";
import { set } from "lodash";
export default function AnalyticDashboard({ lang = "en" }) {
  const { t } = useTranslation();
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_DASHBOARD;
  const API_URL_TEMPLATE = process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE;
  const [activeUser, setActiveUser] = useState("");
  const [templateCount, setTemplateCount] = useState("");
  const [templates, setTemplates] = useState([]);
  const [assetsTotalCount, setAssetsTotalCount] = useState("");
  const [chartData, setChartData] = useState({});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [topTemplate, setTopTemplate] = useState();
  const [storage, setStorage] = useState("");
  // default last 30 days
  const [startDate, setStartDate] = useState(
    new Date(new Date().setDate(new Date().getDate() - 30))
  );
  const [endDate, setEndDate] = useState(new Date());
  const [userChartData, setUserChartData] = useState({
    labels: [],
    datasets: [],
  });

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

  const formatDate = (d) => {
    if (!d) return "";
    return d.toISOString().split("T")[0];
  };

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

  const getAssetsCount = async () => {
    try {
      const response = await axios.get(`${API_URL}dashboard/assets`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data.data.templateCount);
      setAssetsTotalCount(response.data.data.templateCount);
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

  const getS3Storage = async () => {
    try {
      const response = await axios.get(`${API_URL}dashboard/storage`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data.data.bucketSize);

      setStorage(response.data.data.bucketSize);
    } catch (err) {
      console.log(err);
    }
  };

  const getUserChart = async (sDate, eDate) => {
    try {
      const start = formatDate(sDate || startDate);
      const end = formatDate(eDate || endDate);

      const response = await axios.get(
        `${API_URL}dashboard/user-growth?startDate=${start}&endDate=${end}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = response.data?.data || [];
      const labels = data.map((d) => d.date);
      const counts = data.map((d) => d.count);

      setUserChartData({
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
    } catch (err) {
      console.log(err);
      setUserChartData({ labels: [], datasets: [] });
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

  useEffect(() => {
    getUserCount();
    getTemplateCount();
    getTemplate();
    getTopTemplate();
    getS3Storage();
    getUserChart(startDate, endDate);
    getAssetsCount();
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
                          <p>{t("Active Users")}</p>
                          <h3>{activeUser}</h3>
                          <span>{t("Total active users this month")}</span>
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
                          <p>{t("Designs Created")}</p>
                          <h2>{templateCount}</h2>
                          <span>{t("Total designs made by users")}</span>
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
                        <div className="">
                          <p>{t("S3 bucket")}</p>
                          <h2>{storage}</h2>
                          <span>{t("total used storage")}</span>
                        </div>
                      </div>
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
                          <p>{t("Assets")}</p>
                          <h3>{assetsTotalCount}</h3>
                          <span>{t("Total assets created")}</span>
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
                          <p>{t("Designs Created")}</p>
                          <h2>{templateCount}</h2>
                          <span>{t("Total designs made by users")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* <div className="analytic-dashboard">
                  <div className="row dashboard-content">
                    <div className="col-lg-12 col-md-12 col-12">
                      <div className="chart">
                        <UserGrowthChart />
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* <div className="analytic-dashboard">
                  <div className="row dashboard-content">
                    <div className="col-lg-12 col-md-12 col-12">
                      <div className="chart">
                        <TemplateChart />
                      </div>
                    </div>
                  </div>
                </div> */}

                <div className="analytic-dashboard">
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-6">
                      <div className="chart">
                        <p>{t("Top used templates and assets")}</p>
                        <div className="top-templates">
                          {topTemplate?.map((template, index) => (
                            <div
                              className="template-items d-flex gap-2"
                              key={template._id}
                            >
                              <div className="template-number">{index + 1}</div>
                              <div className="template-details w-100">
                                <p>
                                  {template.name.charAt(0).toUpperCase() +
                                    template.name.slice(1)}
                                </p>
                                <p>{template.templateCount}</p>
                              </div>
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
      </div>
    </>
  );
}
