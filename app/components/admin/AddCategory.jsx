"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";

const AddCategoryPage = () => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  const { handleSubmit, register, reset, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      slug: "",
      parentId: "",
      description: "",
    },
  });

  useEffect(() => {
    fetchCategory();
  }, []);

  // Fetch categories for parent dropdown
  const fetchCategory = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}category`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const parentCategories = response.data?.categories.filter(
        (cat) => cat.parentCategory === null
      );
      console.log(parentCategories);
      setCategories(parentCategories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to fetch categories", { theme: "dark" });
    }
  };

  // Auto-generate slug when name changes
  useEffect(() => {
    const nameValue = watch("name") || "";
    setValue("slug", nameValue.trim().toLowerCase().replace(/\s+/g, "-"));
  }, [watch("name"), setValue]);

  const handleCategory = (data) => {
    if (!data.name) {
      toast.error("Category name is required", { theme: "dark" });
      return;
    }
    console.log(data);

    setLoader(true);

    axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}category`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        name: data.name,
        slug: data.slug,
        parentCategory: data.parentId || null,
        description: data.description,
      },
    })
      .then(() => {
        setLoader(false);
        toast.success("Category added", { theme: "dark" });
        reset();
        router.push("/admin/category");
      })
      .catch((err) => {
        setLoader(false);
        console.log("error", err);
        toast.error(err?.response?.data?.message || "Failed to add category", {
          theme: "dark",
        });
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
                    <h3>Add Category</h3>
                  </div>
                </div>
              </div>

              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleCategory)}>
                  {/* Name */}
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("name")}
                      />
                      <small className="text-muted">
                        The name is how it appears on your site.
                      </small>
                    </div>

                    {/* Slug */}
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">Slug</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("slug")}
                      />
                      <small className="text-muted">
                        The “slug” is the URL-friendly version of the name.
                      </small>
                    </div>

                    {/* Parent Category */}
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">Parent Category</label>
                      <select
                        className="form-control"
                        {...register("parentId")}
                        defaultValue=""
                      >
                        <option value="">None</option>
                        {categories &&
                          categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                      <small className="text-muted">
                        Categories can have a hierarchy. Totally optional.
                      </small>
                    </div>

                    {/* Description */}
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        {...register("description")}
                      ></textarea>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex gap-3">
                      <button type="submit" className="button">
                        Add Category
                      </button>
                      <button
                        type="button"
                        className="button"
                        style={{ backgroundColor: "#6c757d" }}
                        onClick={() => router.push("/admin/category")}
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

export default AddCategoryPage;
