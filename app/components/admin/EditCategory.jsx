"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Loader from "../Loader";

export default function EditCategory({ userId }) {
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const router = useRouter();
  const [loader, setLoader] = useState(false);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      subCategories: [{ name: "", description: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subCategories",
  });

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
        description: category.description || "",
        subCategories: category.subCategories?.length
          ? category.subCategories
          : [{ name: "", description: "" }],
      });
    } catch (error) {
      console.error(error);
      toast("Failed to load category", { type: "error" });
    }
  };

  useEffect(() => {
    getCategoryDetails();
  }, []);

  const handleUpdate = async (data) => {
    if (!data.name || !data.description) {
      toast("Category name and description are required", { type: "error" });
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

      toast("Category updated successfully", { type: "success" });
      router.push("/admin/category");
    } catch (error) {
      console.error(error);
      toast(error?.response?.data?.message || "Failed to update category", {
        type: "error",
      });
    } finally {
      setLoader(false);
    }
  };

  return (
    <div id="main_container">
      <div className="inner_container">
        <div className="container-lg container-fluid p-0">
          <div className="comman_admin_layout flex-column p-0">
            <div className="row mb-4">
              <div className="col-12">
                <h3>Edit Category</h3>
              </div>
            </div>

            <div className="admin_form_panel">
              <form onSubmit={handleSubmit(handleUpdate)}>
                <div className="row">
                  {/* Category Name */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <label>Category Name</label>
                    <input
                      type="text"
                      className="form-control"
                      {...register("name")}
                    />
                  </div>

                  {/* Description */}
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <label>Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      {...register("description")}
                    />
                  </div>

                  {/* Dynamic Subcategories */}
                  <div className="col-12">
                    <h5>Subcategories</h5>
                    {fields.map((item, index) => (
                      <div
                        key={item.id}
                        className="d-flex gap-2 mb-3 align-items-start"
                      >
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Subcategory Name"
                          {...register(`subCategories.${index}.name`)}
                        />
                        <textarea
                          className="form-control"
                          placeholder="Subcategory Description"
                          rows={1}
                          {...register(`subCategories.${index}.description`)}
                        />
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => remove(index)}
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => append({ name: "", description: "" })}
                    >
                      + Add Subcategory
                    </button>
                  </div>

                  {/* Buttons */}
                  <div className="col-12 mt-3 d-flex gap-3">
                    <button type="submit" className="button">
                      Update
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
      {loader && <Loader />}
    </div>
  );
}
