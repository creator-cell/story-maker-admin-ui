"use client";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../Loader";
import { WithContext as ReactTags, SEPARATORS } from "react-tag-input";
import { useRouter, useParams } from "next/navigation";
import { FileIcon, defaultStyles } from "react-file-icon";
import { IconDownload, IconEye } from "@tabler/icons-react";
import useDownload from "react-use-downloader";
import { useTranslation } from "react-i18next";

const UpdateAssets = () => {
  const { t } = useTranslation();
  const { download } = useDownload();
  const [loader, setLoader] = useState(false);
  const [roles, setRoles] = useState([]);
  const [oldDocument, setOldDocument] = useState(null);
  const [category, setCategory] = useState([]);
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
      document: "",
      type: "",
      format: "",
      description: "",
      tags: [],
      category: null,
    },
  });

  useEffect(() => {}, []);

  const getAssetsData = () => {
    setLoader(true);
    axios({
      method: "GET",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}assets?id=${ID}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        const tags = [];
        res.data?.data?.tags?.map((p) => {
          tags.push({
            id: p,
            text: p,
          });
        });
        setOldDocument(res.data?.data?.url);
        reset({
          description: res.data?.data?.description,
          format: res.data?.data?.format,
          name: res.data?.data?.name,
          tags: tags,
          type: res.data?.data?.type,
          category: res.data?.data?.category?._id,
        });
      })
      .catch((err) => {
        console.log(err);
        toast(t("Failed to get asset data"), {
          type: "error",
          theme: "light",
          position: "top-right",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const handleUpdateAssets = (data) => {
    setLoader(true);
    const newFormData = new FormData();
    newFormData.append("name", data?.name);
    newFormData.append("document", data?.document?.[0]);
    newFormData.append("type", data?.type);
    newFormData.append("format", data?.format);
    newFormData.append("description", data?.description);
    data?.tags?.map((p, index) => {
      newFormData.append(`tags[${index}]`, p?.text);
    });
    if (data?.category) {
      newFormData.append("category", data.category);
    }
    // newFormData.append("tags", data?.tags?.map(p => { return p?.text }));
    axios({
      method: "PUT",
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}assets/${ID}`,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: newFormData,
    })
      .then((res) => {
        reset({
          description: null,
          document: null,
          format: null,
          name: null,
          tags: [],
          type: null,
        });
        toast(t("assets update successfully"), {
          type: "success",
          theme: "light",
          position: "top-right",
        });
        router.push("/admin/assets");
      })
      .catch((err) => {
        toast(t("Failed to add assets"), {
          type: "error",
          theme: "light",
          position: "top-right",
        });
      })
      .finally(() => {
        setLoader(false);
      });
  };

  const fetchCategories = () => {
    setLoader(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_SERVER_URL_V1}category`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => {
        setCategory(res.data.items || []);
      })
      .catch((err) => {})
      .finally(() => {
        setLoader(false);
      });
  };

  useEffect(() => {
    getAssetsData();
    fetchCategories();
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
                    <h1>{t("Update Assets")}</h1>
                  </div>
                </div>
              </div>

              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleUpdateAssets)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Name")}</label>
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
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Document")}</label>
                        <div className="d-flex align-items-center gap-2 flex-wrap">
                          {oldDocument ? (
                            <div className="d-flex align-items-center gap-2">
                              <div className="doc-file">
                                <FileIcon
                                  extension={
                                    oldDocument
                                      ?.split("/assets/")[1]
                                      ?.split(".")[1]
                                  }
                                  {...defaultStyles[
                                    oldDocument
                                      ?.split("/assets/")[1]
                                      ?.split(".")[1]
                                  ]}
                                />
                              </div>
                              <div className="eye">
                                <a
                                  target="_blank"
                                  href={oldDocument}
                                  className="button align-self-end yellow p-1 rounded-circle"
                                >
                                  <IconEye size={20} stroke={2} />
                                </a>
                              </div>
                            </div>
                          ) : null}
                          <input
                            type="file"
                            className="form-control"
                            name="document"
                            id="document"
                            aria-describedby="helpId"
                            {...register("document")}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Type")}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          {...register("type", {
                            required: {
                              message: "Type is require",
                              value: true,
                            },
                          })}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Format")}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          {...register("format")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Description")}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          {...register("description")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">{t("Tags")}</label>
                        <Controller
                          control={control}
                          name="tags"
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
                                tagInputField: "form-control",
                              }}
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">
                          {t("Select category")}
                        </label>
                        <Controller
                          name="category"
                          control={control}
                          render={({ field }) => (
                            <select
                              {...field}
                              id="category"
                              className="form-control"
                            >
                              <option value="">{t("Choose an option")}</option>
                              {category?.map((p) => {
                                return (
                                  <option value={p?._id}>{p?.name}</option>
                                );
                              })}
                            </select>
                          )}
                        />
                      </div>
                      {errors?.category ? (
                        <p className="text-danger">
                          {errors?.category?.message}
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
                        onClick={() => router.push("/admin/assets")}
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

export default UpdateAssets;
