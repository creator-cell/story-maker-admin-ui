"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import CustomLink from "./CustomLink";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "./Loader";
import React from "react";
import { useTranslation } from "react-i18next";

export default function ForgetPassword() {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_AUTH;
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({ defaultValues: { email: "" } });
  const router = useRouter();
  const [showLoader, setShowLoader] = useState(false);
    const { t } = useTranslation();

  const handleForgotPassword = async (data) => {
    setShowLoader(true);
    try {
      const response = await axios({
        url: `${API_URL}users/forgot-password`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify({
          email: data.email,
        }),
      });

      if (response) {
        // router.push('/reset-password');
        setShowLoader(false);
        toast(
          response.data?.message ||
            t("Reset password link has been sent to your email address."),
          {
            theme: "dark",
            position: "top-right",
            type: "success",
          }
        );
      }
    } catch (error) {
      setShowLoader(false);
      console.log(error);
      toast(error.response.data?.message || t("No email found"), {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
    }
  };

  return (
    <>
      {showLoader && <Loader />}
      <div className="auth">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-lg-5 col-md-5 col-12 d-lg-flex d-md-flex d-none">
              <Image
                src={"/images/forget.svg"}
                width={400}
                height={400}
                alt="forget password"
              />
            </div>
            <div className="col-lg-5 col-md-7 col-12">
              <div className="auth_form">
                <div className="title-dark">
                  <h2>Forgot your password?</h2>
                  <span>No worries—happens to the best of us.</span>
                  <span>
                    Just enter your email below, and we’ll send you a link to
                    reset your password.
                  </span>
                </div>
                <div className="boxwrap">
                  <form
                    action={handleSubmit(handleForgotPassword)}
                    className="row justify-content-center needs-validation"
                    noValidate=""
                  >
                    <div className="col-lg-12 col-md-12 col-12">
                      <div className="mb-input">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email address *"
                          value={watch("email")}
                          {...register("email", {
                            required: {
                              value: true,
                              message: "Email address is required.",
                            },
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                              message: "Invalid email address.",
                            },
                          })}
                        />
                        {errors.email ? (
                          <p className="errMsg">{errors.email.message}</p>
                        ) : null}
                      </div>
                    </div>
                    <div className="col-lg-12 col-md-12 col-12">
                      <input
                        type="submit"
                        value="Reset Password"
                        className="button w-100"
                      />
                    </div>
                    <div className="col-lg-12 col-md-12 col-12 mb-2">
                      <CustomLink className="text-end" href={"/login"}>
                        <i className="fa fa-arrow-left"></i> Back to Login
                      </CustomLink>
                    </div>
                    <div className="col-lg-12 col-md-12 col-12">
                      <span className="form_text">
                        * Signifies a compulsory field
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
