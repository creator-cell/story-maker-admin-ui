"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "../Loader";
import { useTranslation } from "react-i18next";

export default function EditCategory({ userId }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_CATEGORY;
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const { t } = useTranslation();

  const {
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      parentId: "",
      description: "",
    },
  });

  const fetchCategories = async () => {
    try {
      const response = await axios({
        url: `${API_URL}category`,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const parentCategories = response.data?.categories.filter(
        (cat) => cat.parentCategory === null
      );

      setCategories(parentCategories || []);
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to load categories"));
    }
  };

  const getCategoryDetails = async () => {
    try {
      const response = await axios({
        url: `${API_URL}category/${userId}`,
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const category = response.data.category;

      reset({
        name: category.name || "",
        slug: category.slug || "",
        parentId: category.parentCategory || "",
        description: category.description || "",
      });
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to load category"));
    }
  };

  useEffect(() => {
    fetchCategories();
    getCategoryDetails();
  }, []);

  useEffect(() => {
    const nameValue = watch("name") || "";
    if (!watch("slug")) {
      setValue("slug", nameValue.trim().toLowerCase().replace(/\s+/g, "-"));
    }
  }, [watch("name")]);

  const handleUpdate = async (data) => {
    if (!data.name) {
      toast.error(t("Category name is required"));
      toast.error(t("Category name is required"));
      return;
    }

    setLoader(true);
    try {
      await axios({
        url: `${API_URL}category/${userId}`,
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        data,
      });

      toast.success(t("Category updated successfully"));
      router.push("/admin/category");
    } catch (error) {
      console.error(error);
      toast.error(t("Failed to update category")
      );
    } finally {
      setLoader(false);
    }
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
                    <h1>{t("Edit Category")}</h1>
                  </div>
                </div>
              </div>

              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleUpdate)}>
                  {/* Name */}
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">
                        {t("Name")}
                        <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("name")}
                      />
                      <small className="">
                        {t("The name is how it appears on your site.")}
                      </small>
                    </div>

                    {/* Slug */}
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">{t("Slug")}</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("slug")}
                      />
                      <small className="">
                        {t(
                          "The “slug” is the URL-friendly version of the name."
                        )}
                      </small>
                    </div>

                    {/* Parent Category */}
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">
                        {t("Parent Category")}
                      </label>
                      <select
                        className="form-control"
                        {...register("parentId")}
                        defaultValue=""
                      >
                        <option value="">{t("None")}</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <small className="">
                        {t(
                          "Categories can have a hierarchy. Totally optional."
                        )}
                      </small>
                    </div>

                    {/* Description */}
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">{t("Description")}</label>
                      <textarea
                        className="form-control"
                        rows="1"
                        {...register("description")}
                      ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex flex-wrap gap-3">
                      <button type="submit" className="button">
                        {t("Update Category")}
                      </button>
                      <button
                        type="button"
                        className="button"
                        onClick={() => {
                          setLoader(true);
                          router.push("/admin/category");
                        }}
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
}
