"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import CustomLink from "./CustomLink";
import axios from "axios";
import { useForm } from "react-hook-form";
import { setCookie } from "cookies-next/client";
import { login, userStore } from "../redux/UserStore";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "./Loader";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";

const Login = ({ locale }) =>{
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const {
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm({
    defaultValues: { email: "", password: "" },
  });
  const { t } = useTranslation();
  const [user, setUser] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
  const [showVerifyLink, setShowVerifyLink] = useState(false);
  const pathname = usePathname();
  const [lang, setLang] = useState(locale || "en");
  const [loader, setLoader] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const langRef = useRef(null);
  const themeRef = useRef(null);
  
  const handleLogin = async (data) => {
    setShowLoader(true);
    try {
      const response = await axios({
        url: `${API_URL}auth/login`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      if (response.data) {
        setUser(response.data);
        toast(t("Login Successfully"), {
          theme: "dark",
          position: "top-right",
          type: "success",
        });

        const adminUser = {
          ...response.data?.user,
          isAdmin: true,
          role: response.data?.user.role,
        };

        localStorage.setItem("user", JSON.stringify(adminUser));

        const adminToken = {
          ...response.data?.token,
          isAdmin: true,
        };

        setCookie("token", response.data.token);

        userStore.dispatch(
          login({
            user: adminUser,
            token: response.data.token,
          })
        );
        router.push("/admin/users");

        setShowLoader(false);
      } else {
        setShowLoader(false);
        toast(t("Please verify your account."), {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
        setShowVerifyLink(true);
      }
    } catch (error) {
      setShowLoader(false);
      if (error.response.data?.code === 500) {
        toast(t("Email not found."), {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
      } else {
        toast(t("Invalid Credentials"), {
          theme: "dark",
          position: "top-right",
          type: "error",
        });
      }
    }
  };
  const handleChangeLanguage = async (newLang) => {

    const pathSegments = pathname.split("/").filter(Boolean);
    if (["en", "ar"].includes(pathSegments[0])) pathSegments.shift();

    const newPath = "/" + newLang + (pathSegments.length ? "/" + pathSegments.join("/") : "");

    setLang(newLang);
    router.replace(newPath);
  };

  useEffect(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments[0] === "ar" || segments[0] === "en") {
      setLang(segments[0]);
    } else {
      setLang("en");
    }
  }, [pathname]);
  // Handles closing both dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (themeRef.current && !themeRef.current.contains(event.target)) {
        setIsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <>
          <div className="login_header">
            <div className="container">
              <div className="row justify-content-between align-items-center">
                <div className="col-lg-12">
                  <div className="header_right">
                    <div className="togglers">
                      <div className="toggle_theme" ref={themeRef}>
                        <button 
                          className="dropdown-toggle"
                          onClick={() => setIsOpen(isOpen ? false : true)}
                        >
                          {theme === 'dark' ? 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-moon" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg>
                            : 
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg> 
                          }
                        </button>
                        {isOpen && (
                          <div className="dropdown-menu dropright" style={{ display: isOpen ? 'block' : 'none' }}>
                            <div className="dropdown-item" onClick={() => { setTheme('light'); setIsOpen(false); }}>
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="items">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-brightness-high" viewBox="0 0 16 16"><path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/></svg><span>{t("Light")}</span>
                                </div>
                                {theme === 'light' && (<i className="fa-solid fa-check"></i>)}
                              </div>
                            </div>
                            <div className="dropdown-item" onClick={() => { setTheme('dark'); setIsOpen(false); }}>
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="items">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-moon" viewBox="0 0 16 16"><path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/></svg><span>{t("Dark")}</span>
                                </div>
                                {theme === 'dark' && (<i className="fa-solid fa-check"></i>)}
                              </div>
                              </div>
                          </div>
                        )}
                      </div>
                      <div className="toggle_theme" ref={langRef}>
                        <button 
                          className="dropdown-toggle"
                          onClick={() => setIsLangOpen(isLangOpen ? false : true)}
                        >
                          {lang === 'en' ? 
                            <Image src="/flags/gb.svg" alt="english" width={20} height={20} />
                            : 
                            <Image src="/flags/ar.svg" alt="arabic" width={20} height={20} />
                          }
                        </button>
                        {isLangOpen && (
                          <div className="dropdown-menu dropright" style={{ display: isLangOpen ? 'block' : 'none' }}>
                            <div className="dropdown-item" 
                              onClick={() => {
                                setLoader(true);
                                handleChangeLanguage('en');
                                setIsLangOpen(false);
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="items">
                                  <Image src="/flags/gb.svg" alt="english" width={20} height={20} />
                                  <span>{t("English")}</span>
                                </div>
                                {lang === "en" && <i className="fa-solid fa-check"></i>}
                              </div>
                            </div>
                            <div className="dropdown-item" 
                              onClick={() => {
                                setLoader(true);
                                handleChangeLanguage('ar');
                                setIsLangOpen(false);
                              }}
                            >
                              <div className="d-flex justify-content-between align-items-center w-100">
                                <div className="items">
                                  <Image src="/flags/ar.svg" alt="arabic" width={20} height={20} />
                                  <span>{t("Arabic")}</span>
                                </div>
                                {lang === "ar" && <i className="fa-solid fa-check"></i>}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="auth">
            <div className="container h-100">
              <div className="row h-100 justify-content-center align-items-center">
                <div className="col-lg-5 col-md-7 col-12 mt-10">
                  <div className="auth_form">
                    <div className="mx-auto d-grid" style={{ width: "100px" }}>
                      <img src="/frontCloud.png" alt="" className="mx-auto" />
                    </div>
                    <div className="boxwrap">
                      <form
                        action={handleSubmit(handleLogin)}
                        className="row justify-content-center needs-validation"
                      >
                        <div className="col-lg-12 col-md-12 col-12">
                          <label htmlFor="email" className="form-label">
                            {t("Email Address")}
                          </label>
                          <div className="mb-input">
                            <input
                              id="email"
                              type="email"
                              className="form-control"
                              placeholder={t("Enter your email")}
                              value={watch("email") || ""}
                              {...register("email", {
                                required: {
                                  value: true,
                                  message: t("Email Address Required."),
                                },
                                pattern: {
                                  value:
                                    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                  message: "Invalid Email Address",
                                },
                              })}
                              required=""
                            />
                            {errors.email ? (
                              <p className="errMsg">{errors.email.message}</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-12">
                          <label htmlFor="password" className="form-label">
                            {t("Password")}
                          </label>
                          <div className="mb-input">
                            <div className="password_eye">
                              <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                placeholder={t("Enter your password")}
                                value={watch("password") || ""}
                                {...register("password", {
                                  required: {
                                    value: true,
                                    message: t("Password Required"),
                                  },
                                  pattern: {
                                    value:
                                      /^(?=.*\d)(?=.*[a-z])(?=.*[a-zA-Z]).{6,}$/,
                                    message: "Invalid Password",
                                  },
                                })}
                                required=""
                              />
                              {showPassword ? (
                                <i
                                  onClick={() => setShowPassword(false)}
                                  className="fa fa-eye"
                                ></i>
                              ) : (
                                <i
                                  onClick={() => setShowPassword(true)}
                                  className="fa fa-eye-slash"
                                ></i>
                              )}
                            </div>
                            {errors.password ? (
                              <p className="errMsg">{errors.password.message}</p>
                            ) : null}
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12 col-12">
                          <div className="d-flex justify-content-center">
                            <input
                              type="submit"
                              value={t("Log in")}
                              className="login-btn"
                            />
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default Login