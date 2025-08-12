"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import SunEditor to prevent SSR issues
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
import "suneditor/dist/css/suneditor.min.css";

export default function EditTemplatePage({ id }) {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const router = useRouter();

  const { handleSubmit, register, reset, watch, setValue } = useForm({
    defaultValues: {
      name: "",
      category: "",
      subCategory: "",
      content: "",
    },
  });

  useEffect(() => {
    fetchCategories();
    if (id) {
      fetchTemplate();
    }
    // eslint-disable-next-line
  }, [id]);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}category`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error("Failed to fetch categories");
    }
  };

  // Fetch template details
  const fetchTemplate = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}template/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const t = res.data.template;
      setValue("name", t.name || "");
      setValue("category", t.category || "");
      setValue("subCategory", t.subCategory || "");
      setValue("content", t.content || "");
      // Set subcategories for selected category
      if (t.category) {
        const subs = categories.filter(
          (cat) => cat.parentCategory === t.category
        );
        setSubCategories(subs);
      }
    } catch (err) {
      toast.error("Failed to load template");
    } finally {
      setLoader(false);
    }
  };

  // Filter parent categories (no parentCategory)
  const parentCategories = categories.filter((cat) => !cat.parentCategory);

  // When parent category changes, filter subcategories
  const handleCategoryChange = (categoryId) => {
    setValue("category", categoryId);
    const subs = categories.filter((cat) => cat.parentCategory === categoryId);
    setSubCategories(subs);
    setValue("subCategory", "");
  };

  // Save edited template
  const handleTemplateSave = async (data) => {
    if (!data.name || !data.category || !data.subCategory || !data.content) {
      toast.error("All fields are required");
      return;
    }
    setLoader(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}template/${id}`,
        {
          name: data.name,
          category: data.category,
          subCategory: data.subCategory,
          content: data.content,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Template updated successfully");
      router.push("/admin/template");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update template");
    } finally {
      setLoader(false);
    }
  };

  // Approve/Reject template
  const handleApproveReject = async (status) => {
    setLoader(true);
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}template/${id}/status`,
        { status },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(`Template ${status.toLowerCase()} successfully`);
      router.push("/admin/template");
    } catch {
      toast.error(`Failed to ${status.toLowerCase()} template`);
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
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="title_head">
                  <h3>Edit Template</h3>
                </div>
              </div>
            </div>
            <div className="admin_form_panel">
              <form onSubmit={handleSubmit(handleTemplateSave)}>
                <div className="row">
                  {/* Template Name */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="form_group">
                      <label>Template Name</label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("name")}
                        value={watch("name")}
                        onChange={(e) => setValue("name", e.target.value)}
                      />
                    </div>
                  </div>
                  {/* Category Dropdown */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="form_group">
                      <label>Category</label>
                      <select
                        className="form-control"
                        value={watch("category")}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                      >
                        <option value="">Select Category</option>
                        {parentCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Subcategory Dropdown */}
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="form_group">
                      <label>Subcategory</label>
                      <select
                        className="form-control"
                        value={watch("subCategory")}
                        onChange={(e) =>
                          setValue("subCategory", e.target.value)
                        }
                        disabled={!subCategories.length}
                      >
                        <option value="">Select Subcategory</option>
                        {subCategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {/* Template Content - SunEditor */}
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <div className="form_group">
                      <label>Template Content</label>
                      <SunEditor
                        height="300px"
                        setContents={watch("content")}
                        onChange={(content) => setValue("content", content)}
                        setOptions={{
                          buttonList: [
                            ["undo", "redo"],
                            ["bold", "italic", "underline", "strike"],
                            ["font", "fontSize"],
                            ["fontColor", "hiliteColor"],
                            ["align", "list", "table"],
                            ["link", "image", "video"],
                            ["fullScreen", "showBlocks", "codeView"],
                          ],
                        }}
                      />
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="col-12 mt-3 d-flex gap-3">
                    <button type="submit" className="button">
                      Save
                    </button>
                    <button
                      type="button"
                      className="button"
                      style={{ backgroundColor: "#198754" }}
                      onClick={() => handleApproveReject("Approved")}
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="button"
                      style={{ backgroundColor: "#dc3545" }}
                      onClick={() => handleApproveReject("Rejected")}
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      className="button"
                      style={{ backgroundColor: "#6c757d" }}
                      onClick={() => router.push("/admin/template")}
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
