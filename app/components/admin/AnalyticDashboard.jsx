"use client";
import $ from 'jquery';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel';
import { useEffect } from 'react';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function AnalyticDashboard({ lang = "en" }) {
    const { t } = useTranslation();

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
                                    <div className="row dashboard-content" >
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="box justify-content-center align-items-center">
                                                <div className="icon">
                                                    <img src="/images/active-user.png" alt="active-user" />
                                                </div>
                                                <div className="">
                                                    <p >Active Users</p>
                                                    <span >Total active users this month      </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="box justify-content-center align-items-center">
                                                <div className="icon">
                                                    <img src="/images/design-create.png" alt="active-user" />
                                                </div>
                                                <div className="">
                                                    <p >Designs Created</p>
                                                    <span >Total designs made by users</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-lg-4 col-md-4 col-12">
                                            <div className="box justify-content-center align-items-center">
                                                <div className="icon">
                                                    <img src="/images/use-template.png" alt="active-user" />
                                                </div>
                                                <div className="">
                                                    <p >Templates Used</p>
                                                    <span >Number of templates applied</span>
                                                </div>
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
                                                <p>Storage usage</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="analytic-dashboard" dir={lang === "ar" ? "rtl" : "ltr"}>
                                    <div className="row">
                                        <div className="col-lg-12 col-md-12 col-12 chart">
                                            <p>Top used templates and asset </p>
                                            <div className="slider autoplay">
                                                <div className='boxes'>
                                                    <img src="/images/template.jpg" alt="Template" />
                                                </div>
                                                <div className='boxes'>
                                                    <img src="/images/templates.webp" alt="Template" />
                                                </div>
                                                <div className='boxes'>
                                                    <img src="/images/template.jpg" alt="Template" />
                                                </div>
                                                <div className='boxes'>
                                                    <img src="/images/templates.webp" alt="Template" />
                                                </div>
                                                <div className='boxes'>
                                                    <img src="/images/template.jpg" alt="Template" />
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
    )
}