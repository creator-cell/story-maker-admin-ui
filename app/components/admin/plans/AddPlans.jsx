"use client";
import React, { useState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "@/app/components/Loader";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const AddPlans = () => {
  const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [roles, setRoles] = useState([]);
  const router = useRouter();

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      title: "",
      description: "",
      price: null,
      duration: null,
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "plans",
  });

  const handleAddAssets = (data) => {
    setLoader(true);
    axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}billing-subscription/plan`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: JSON.stringify({
        ...data,
        features:
          data?.features?.length > 0
            ? data?.features?.map((p) => {
                return p.id;
              })
            : [],
      }),
    })
      .then((res) => {
        reset({
          name: "",
          title: "",
          description: "",
          price: null,
          duration: null,
          features: [],
        });
        toast(t("plan added successfully"), {
          type: "success",
          theme: "light",
          position: "top-right",
        });
        router.push("/admin/plans");
      })
      .catch((err) => {
        toast(t("Failed to add plans"), {
          type: "error",
          theme: "light",
          position: "top-right",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  return (
    <div id="main_container">
      <div className="inner_container">
        <div className="container-lg container-fluid p-0">
          <div className="comman_admin_layout flex-column p-0">
            <div className="container-lg container-fluid p-0">
              <div className="row mb-4">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="title_head">
                    <h1>{t("Add New Plan")}</h1>
                  </div>
                </div>
              </div>

              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleAddAssets)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">
                          {t("Name")} <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          {...register("name", {
                            required: {
                              message: t("Name is required."),
                              value: true,
                            },
                          })}
                        />
                      </div>
                      {errors?.name ? (
                        <p className="text-danger">{errors?.name?.message}</p>
                      ) : null}
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">
                          {t("Title")} <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          {...register("title", {
                            required: {
                              message: t("Document is require"),
                              value: true,
                            },
                          })}
                        />
                      </div>
                      {errors?.title ? (
                        <p className="text-danger">{errors?.title?.message}</p>
                      ) : null}
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Description")}</label>
                        <textarea
                          className="form-control"
                          {...register("description", {
                            required: {
                              value: true,
                              message: t("Description is required"),
                            },
                          })}
                        ></textarea>
                      </div>
                      {errors?.description ? (
                        <p className="text-danger">
                          {errors?.description?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Price")}</label>
                        <input
                          className="form-control"
                          type="number"
                          name=""
                          id=""
                          {...register("price", {
                            required: {
                              value: true,
                              message: t("Price is required"),
                            },
                            min: { value: 0, message: "Price is invalid" },
                          })}
                        />
                      </div>
                      {errors?.price ? (
                        <p className="text-danger">{errors?.price?.message}</p>
                      ) : null}
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">
                          {t("Duration")} <span className="text-danger">*</span>
                        </label>
                        <Controller
                          control={control}
                          name="duration"
                          render={({ field: { onChange, value } }) => {
                            return (
                              <select
                                className="form-control"
                                value={value}
                                onChange={onChange}
                              >
                                <option value="" selected>
                                  {t("Please select")}
                                </option>
                                <option value="monthly">{t("Monthly")}</option>
                                <option value="yearly">{t("Yearly")}</option>
                              </select>
                            );
                          }}
                          rules={{
                            required: {
                              value: true,
                              message: t("Plan duration is required"),
                            },
                          }}
                        />
                      </div>
                      {errors?.duration ? (
                        <p className="text-danger">
                          {errors?.duration?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="features">{t("Features")}</label>
                        <Controller
                          control={control}
                          name="features"
                          render={({ field: { onChange, value = [] } }) => {
                            const [inputValue, setInputValue] =
                              React.useState("");

                            const handleAdd = () => {
                              const trimmed = inputValue.trim();
                              if (trimmed) {
                                onChange([...value, { name: trimmed }]);
                                setInputValue("");
                              }
                            };

                            const handleDelete = (index) => {
                              onChange(value.filter((_, i) => i !== index));
                            };

                            return (
                              <>
                                <div className="d-flex gap-2">
                                  <input
                                    type="text"
                                    className="form-control"
                                    value={inputValue}
                                    onChange={(e) =>
                                      setInputValue(e.target.value)
                                    }
                                    placeholder={t("Enter a feature")}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleAdd}
                                    disabled={!inputValue.trim()}
                                  >
                                    {t("Add")}
                                  </button>
                                </div>

                                <ul className="mt-2 list-unstyled">
                                  {value.map((item, index) => (
                                    <li
                                      key={index}
                                      className="d-flex justify-content-between align-items-center border rounded p-2 mb-2"
                                    >
                                      <span>{item.name}</span>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() => handleDelete(index)}
                                      >
                                        {t("Delete")}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              </>
                            );
                          }}
                        />
                      </div>
                      {errors?.features && (
                        <p className="text-danger">{errors.features.message}</p>
                      )}
                    </div>

                    <div className="col-12 mt-3 d-flex gap-3">
                      <button type="submit" className="button">
                        {t("Submit")}
                      </button>
                      <button
                        type="button"
                        className="button"
                        onClick={() => router.push("/admin/plans")}
                      >
                        {t("Cancel")}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loader && <Loader />}
    </div>
  );
};

export default AddPlans;
