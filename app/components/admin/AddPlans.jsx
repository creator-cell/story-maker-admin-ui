"use client";
import React, { useState, useEffect } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";

import { useRouter } from "next/navigation";

const AddPlans = () => {
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
      type: null,
      plans: [{ price: 0, duration: null, value: 1 }],
      features: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: control,
    name: "plans",
  });

  useEffect(() => {}, []);

  const handleAddAssets = (data) => {
    console.log(data);
    setLoader(true);
    axios({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_PLANS}plan`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: JSON.stringify({
        ...data,
        features: data?.features?.length > 0 ? data?.features?.map(p => { return p.id }) : []
      }),
    })
      .then((res) => {
        reset({
          name: "",
          title: "",
          description: "",
          type: null,
          plans: [{ price: 0, duration: null, value: 1 }],
          features: [],
        });
        toast(res?.data?.message || "plan added successfully", {
          type: "success",
          theme: "light",
          position: "top-right",
        });
        router.push("/admin/plans");
      })
      .catch((err) => {
        toast(
          err?.response?.data?.errors?.[0]?.message ??
            err?.response?.data?.message ??
            "Failed to add plans",
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

  return (
    <div id="main_container">
      <div className="inner_container">
        <div className="container-lg container-fluid p-0">
          <div className="comman_admin_layout flex-column p-0">
            <div className="container-lg container-fluid p-0">
              <div className="row mb-4">
                <div className="col-lg-12 col-md-12 col-sm-12">
                  <div className="title_head">
                    <h3>Add New Plan</h3>
                  </div>
                </div>
              </div>

              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleAddAssets)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">
                          Name <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          {...register("name", {
                            required: {
                              message: "Name is required.",
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
                          Title <span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          {...register("title", {
                            required: {
                              message: "Document is require",
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
                        <label htmlFor="full-name">Description</label>
                        <textarea className="form-control" {...register("description", { required:{ value:true, message:"Description is required" } })}>
                        </textarea>
                      </div>
                      {errors?.description ? (
                        <p className="text-danger">
                          {errors?.description?.message}
                        </p>
                      ) : null}
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">
                          Type <span className="text-danger">*</span>
                        </label>
                        <Controller
                          control={control}
                          name="type"
                          render={({ field: { onChange, value } }) => {
                            return (
                              <select value={value} onChange={onChange}>
                                <option value="" selected>
                                  Please select
                                </option>
                                <option value="team">Team</option>
                                <option value="individual">Individual</option>
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
                        <label htmlFor="full-name">Features</label>
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

                    {fields.map((p, index) => {
                      return (
                        <>
                          <div className="row align-items-end">
                            <div className="col-md-3">
                              <Controller
                                control={control}
                                name={`plans.[${index}].price`}
                                render={({ field: { onChange, value } }) => {
                                  return (
                                    <div className="form_group">
                                      <label htmlFor="full-name">Price</label>
                                      <input
                                        type="text"
                                        className="form-control"
                                        name="full-name"
                                        id="full-name"
                                        aria-describedby="helpId"
                                        value={value}
                                        onChange={onChange}
                                      />
                                    </div>
                                  );
                                }}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Price is require",
                                  },
                                }}
                              />
                              {errors.plans?.[index]?.price ? (
                                <p className="errMsg">
                                  {errors.plans?.[index].price.message}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>

                            <div className="col-md-3">
                              <Controller
                                control={control}
                                name={`plans.[${index}].duration`}
                                render={({ field }) => (
                                  <div className="form_group">
                                    <label htmlFor="full-name">Duration</label>
                                    <select {...field}>
                                      <option value="">Please select</option>
                                      <option value="day">day</option>
                                      <option value="week">week</option>
                                      <option value="month">month</option>
                                    </select>
                                  </div>
                                )}
                                rules={{
                                  required: {
                                    value: true,
                                    message: "Duration is required",
                                  },
                                }}
                              />
                              {errors.plans?.[index]?.duration ? (
                                <p className="errMsg">
                                  {errors.plans?.[index].duration.message}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>

                            <div className="col-md-3">
                              <Controller
                                control={control}
                                name={`plans.[${index}].value`}
                                render={({ field: { value, onChange } }) => (
                                  <div className="form_group">
                                    <label htmlFor="full-name">
                                      Duration value
                                    </label>
                                    <input
                                      type="number"
                                      className="form-control"
                                      name="full-name"
                                      id="full-name"
                                      aria-describedby="helpId"
                                      value={value}
                                      onChange={onChange}
                                    />
                                  </div>
                                )}
                                rules={{
                                  min: {
                                    value: 1,
                                    message:
                                      "Duration value must be grater then 0",
                                  },
                                }}
                              />
                              {errors.plans?.[index]?.value ? (
                                <p className="errMsg">
                                  {errors.plans?.[index].value.message}
                                </p>
                              ) : (
                                ""
                              )}
                            </div>

                            <div className="col-md-3">
                              <button
                                onClick={() => remove(index)}
                                type="button"
                                className="btn btn-danger mb-3"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </>
                      );
                    })}

                    <button
                      onClick={() =>
                        append({
                          price: 0,
                          duration: null,
                          value: 0,
                        })
                      }
                      type="button"
                      className=" button yellow btn btn-primary"
                    >
                      Add more
                    </button>

                    <div className="col-12 mt-3 d-flex gap-3">
                      <button type="submit" className="button">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="button"
                        style={{ backgroundColor: "#6c757d" }}
                        onClick={() => router.push("/admin/assets")}
                      >
                        Cancel
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
