"use client";
import React, { useState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const UpdatePlans = () => {
    const { t } = useTranslation();
  const [loader, setLoader] = useState(false);
  const [roles, setRoles] = useState([]);
  const router = useRouter();
  const { ID } = useParams();

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

  const getPlanData = () => {
    setLoader(true);
    axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}billing-subscription/plan?id=${ID}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const features = [];
        res.data?.data?.features?.map((p) => {
          features.push({
            id: p,
            text: p,
          });
        });
        reset({
          description: res.data?.data?.description,
          name: res.data?.data?.name,
          title: res.data?.data?.title,
          type: res.data?.data?.type,
          features: features,
          price: res.data?.data?.price,
          duration: res.data?.data?.duration
        });
      })
      .catch((err) => {
        console.log(err);
        toast(t("Failed to get plan data"), {
          type: "error",
          theme: "light",
          position: "top-right",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleUpdatePlan = (data) => {
    setLoader(true);
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}billing-subscription/plan/${ID}`,
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
        toast(t("plan updated successfully"), {
          type: "success",
          theme: "light",
          position: "top-right",
        });
        router.push("/admin/plans");
      })
      .catch((err) => {
        toast(t("Failed to update plans"),
          {
            type: "error",
            theme: "light",
            position: "top-right",
          }
        );
      })
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getPlanData();
  }, []);

  return (
    <div id="main_container">
      <div className="inner_container">
        <div className="container-lg container-fluid p-0">
          <div className="comman_admin_layout flex-column p-0">
            <div className="container-lg container-fluid p-0">
              <div className="row mb-4">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="title_head">
                    <h1>{t("Update Plan")}</h1>
                  </div>
                </div>
              </div>

              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleUpdatePlan)}>
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
                          {...register("price", { required: { value: true, message: t("Price is required") }, min: { value: 0, message: "Price is invalid" } })} />
                      </div>
                      {errors?.price ? (
                        <p className="text-danger">
                          {errors?.price?.message}
                        </p>
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
                              <select className="form-control" value={value} onChange={onChange}>
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
                              message: "Plan type is required",
                            },
                          }}
                        />
                      </div>
                      {errors?.type ? (
                        <p className="text-danger">{errors?.type?.message}</p>
                      ) : null}
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Features")}</label>
                        <Controller
                          control={control}
                          name="features"
                          render={({ field: { onChange, value } }) => (
                            <ReactTags
                              tags={value}
                              separators={[SEPARATORS.COMMA, SEPARATORS.ENTER]}
                              handleDelete={(index) => {
                                const filterTags = value?.filter(
                                  (f, i) => i != index
                                );
                                onChange(filterTags);
                              }}
                              handleAddition={(tag) => {
                                if (!value) {
                                  onChange([tag]);
                                } else {
                                  onChange([...value, tag]);
                                }
                              }}
                              classNames={{
                                tagInputField: "form-control"
                              }}
                            />
                          )}
                        />
                      </div>
                      {errors?.features ? (
                        <p className="text-danger">
                          {errors?.features?.message}
                        </p>
                      ) : null}
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

export default UpdatePlans;
