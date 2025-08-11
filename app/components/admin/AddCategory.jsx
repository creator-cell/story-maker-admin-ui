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
  const [subCategories, setSubCategories] = useState([
    { name: "", description: "" },
  ]);
  const router = useRouter();

  const { handleSubmit, register, reset, watch } = useForm({
    defaultValues: {
      name: "",
      description: "",
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
      console.error("Error fetching categories:", error);
      toast("Failed to fetch categories", {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
    }
  };

  const handleCategory = (data) => {
    const missingFields = [];

    if (!data.name) missingFields.push("Category name");
    if (!data.description) missingFields.push("Category description");

    // Validate subcategories: description only if name exists
    const validSubCategories = subCategories.filter(
      (sub) => sub.name && sub.description
    );

    const invalidSubs = subCategories.some(
      (sub) => sub.description && !sub.name
    );
    if (invalidSubs) {
      missingFields.push("Sub category name for provided description");
    }

    if (missingFields.length > 0) {
      toast(`${missingFields.join(", ")} is required`, {
        theme: "dark",
        position: "top-right",
        type: "error",
      });
      return;
    }

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
        description: data.description,
        subCategories: validSubCategories,
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
        setSubCategories([{ name: "", description: "" }]); // Reset subs
        router.push("/admin/category");
      })
      .catch((err) => {
        setLoader(false);
        console.log("error", err);
        toast(err?.response?.data?.message || "Failed to add category", {
          type: "error",
          theme: "dark",
          position: "top-right",
        });
      });
  };

  const handleAddSubCategory = () => {
    setSubCategories([...subCategories, { name: "", description: "" }]);
  };

  const handleRemoveSubCategory = (index) => {
    const updated = [...subCategories];
    updated.splice(index, 1);
    setSubCategories(updated);
  };

  const handleSubCategoryChange = (index, field, value) => {
    const updated = [...subCategories];
    updated[index][field] = value;
    setSubCategories(updated);
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
                    {/* Category Name */}
                    <div className="col-lg-6 col-md-6 col-12 mb-3">
                      <div className="form_group">
                        <label>Category Name</label>
                        <input
                          name="full-name"
                          id="full-name"
                          className="form-control"
                          value={watch("name") || ""}
                          {...register("name")}
                        />
                      </div>
                    </div>

                    {/* Category Description */}
                    <div className="col-lg-12 col-md-12 col-12 mb-3">
                      <div className="form_group">
                        <label>Description</label>
                        <textarea
                          className="form-control"
                          {...register("description")}
                          value={watch("description") || ""}
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <h5>Sub Categories</h5>
                      {subCategories.map((sub, index) => (
                        <div
                          key={index}
                          className="d-flex gap-2 align-items-start mb-2"
                        >
                          <input
                            type="text"
                            placeholder="Subcategory Name"
                            className="form-control"
                            value={sub.name}
                            onChange={(e) =>
                              handleSubCategoryChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                          />
                          <input
                            type="text"
                            placeholder="Subcategory Description"
                            className="form-control"
                            value={sub.description}
                            onChange={(e) =>
                              handleSubCategoryChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                          />
                          {subCategories.length > 1 && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleRemoveSubCategory(index)}
                            >
                              X
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        className="btn btn-primary mt-2"
                        onClick={handleAddSubCategory}
                      >
                        + Add Subcategory
                      </button>
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
