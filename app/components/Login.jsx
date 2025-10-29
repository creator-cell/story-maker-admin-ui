"use client";
import React, { useState, useEffect } from "react";
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

const Login = ({ locale }) =>{
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_AUTH;
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

  const handleLogin = async (data) => {
    setShowLoader(true);
    try {
      const response = await axios({
        url: `${API_URL}users/login`,
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

  return (
    <>
      {showLoader ? (
        <Loader />
      ) : (
        <div
          className="auth"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(to bottom right, #ffffff, #d9d9d9)",
          }}
        >
           <div id="languageswitcher" className="languageswitcher-login">
                <div className="cust-check-group">
                  <div className="cust-check">
                    <label className="form-check-label" htmlFor="English">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="language"
                        id="English"
                        value="en"
                        onChange={(t) => {
                          setLoader(true);
                          handleChangeLanguage(t.target.value);
                        }}
                        checked={lang === "en" ? true : false}
                      />
                      <Image
                        src="/flags/gb.svg"
                        alt="english"
                        width={20}
                        height={20}
                      />
                    </label>
                  </div>
                  <div className="cust-check">
                    <label className="form-check-label" htmlFor="Arabic">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="language"
                        id="Arabic"
                        value="ar"
                        onChange={(t) => {
                          setLoader(true);
                          handleChangeLanguage(t.target.value);
                        }}
                        checked={lang === "ar" ? true : false}
                      />
                      <Image
                        src="/flags/ar.svg"
                        alt="arabic"
                        width={20}
                        height={20}
                      />
                    </label>
                  </div>
                </div>
              </div>
          <div className="container">
            <div className="row justify-content-center align-items-center">
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
      )}
    </>
  );
}
export default Login