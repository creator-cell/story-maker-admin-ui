"use client";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";

import { useRouter } from "next/navigation";
import Category from "./../../(adminSide)/admin/category/page";

const AddCategoryPage = () => {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
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
      description: "",
      subname: "",
      subdescription: "",
    },
  });

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}category`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCategories(response.data?.categories || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast("Failed to fetch roles", {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
    }
  };

  const handleCategory = (data) => {
    const missingFields = [];

    // Check all required fields
    if (!data.name) missingFields.push("Category name");
    if (!data.description) missingFields.push("Category description");
    if (data.subdescription && !data.subName)
      missingFields.push("Sub category name");
    if (missingFields.length > 0) {
      toast(`${missingFields.join(", ")} is required`, {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
      return;
    }
    setLoader(true);
    let subCategories = [];
    if (data.subname && data.data.subdescription) {
      subCategories.push({
        name: data.subname,
        description: data.subdescription,
      });
    }
    axios({
      url: `${process.env.NEXT_PUBLIC_SERVER_URL_V1}category`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      data: {
        name: data.name,
        description: data.description,
        subCategories,
      },
    })
      .then((res) => {
        setLoader(false);

        toast("Category added", {
          theme: "dark",
          position: "top-right",
          type: "success",
        });
        reset();
        // Navigate back to user list page
        router.push("/admin/category");
      })
      .catch((err) => {
        setLoader(false);
        console.log("error", err);
        toast(err?.response?.data?.message || "failed to add category", {
          type: "error",
          theme: "dark",
          position: "top-right",
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
                    <h3>Add New Category</h3>
                  </div>
                </div>
              </div>

              <div className="admin_form_panel">
                <form onSubmit={handleSubmit(handleCategory)}>
                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">Category Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="full-name"
                          id="full-name"
                          aria-describedby="helpId"
                          value={watch("name") || ""}
                          {...register("name")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="email">Description</label>
                        <textarea
                          type="textarea"
                          className="form-control"
                          name="Description"
                          id="Description"
                          row={3}
                          cols={3}
                          aria-describedby="helpId"
                          value={watch("description") || ""}
                          {...register("description")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="full-name">Sub Category Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="fname"
                          id="fname"
                          aria-describedby="helpId"
                          value={watch("subname") || ""}
                          {...register("subname")}
                        />
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-12 mb-3">
                      <div className="form_group">
                        <label htmlFor="email">Sub Category Description</label>
                        <textarea
                          type="textarea"
                          className="form-control"
                          name="subDescription"
                          id="subDescription"
                          row={3}
                          cols={3}
                          aria-describedby="helpId"
                          value={watch("subdescription") || ""}
                          {...register("subdescription")}
                        />
                      </div>
                    </div>

                    <div className="col-12 mt-3 d-flex gap-3">
                      <button type="submit" className="button">
                        Submit
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
