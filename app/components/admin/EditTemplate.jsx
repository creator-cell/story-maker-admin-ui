"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from "../../components/Loader";
import { useRouter } from "next/navigation";
import DeleteTemplate from "@/app/(adminSide)/model/DeleteTemplate";
import ApproveTemplate from "@/app/(adminSide)/model/ApproveTemplate";
import { fabric } from "fabric";
import FabricTextEditorToolbar from "./canvas/FabricTextEditorToolbar";
import FabricToolbar from "./FabricToolBar";

export default function EditTemplatePage({ id, isClone }) {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [approveModel, setApproveModel] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const router = useRouter();
  const userStr = localStorage.getItem("user");

  const userObj = userStr ? JSON.parse(userStr) : null;

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);

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
    initCanvas();
  }, [id]);

  // const initCanvas = () => {
  //   const canvas = new fabric.Canvas("fabricCanvas", {
  //     width: 800,
  //     height: 500,
  //     backgroundColor: "#fff",
  //   });
  //   fabricRef.current = canvas;
  // };
  const initCanvas = () => {
    if (fabricRef.current) {
      fabricRef.current.dispose();
    }

    const canvas = new fabric.Canvas("fabricCanvas", {
      width: 800,
      height: 500,
      backgroundColor: "#fff",
      selection: true,
      preserveObjectStacking: true,
    });

    canvas.on("object:added", (e) => {
      if (e.target) {
        e.target.set({
          selectable: true,
          hasControls: true,
          hasBorders: true,
        });
      }
    });

    fabricRef.current = canvas;
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}category`,
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

  const [templateData, setTemplateData] = useState(null);

  const fetchTemplate = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      const t = res.data.template;
      setTemplateData(t); // store for later

      setValue("name", t.name || "");
      setValue("category", t.category?._id || "");
      setValue("subCategory", t.subCategory?._id || "");
      setValue("content", t.content || "");

      if (t.content && fabricRef.current) {
        fabricRef.current.loadFromJSON(t.content, () => {
          fabricRef.current.getObjects().forEach((obj) => {
            obj.set({
              selectable: true,
              hasControls: true,
              hasBorders: true,
            });
          });
          fabricRef.current.renderAll();
        });
      }
    } catch (err) {
      toast.error("Failed to load template");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    if (templateData?.category?._id && categories.length > 0) {
      const subs = categories.filter(
        (cat) => cat.parentCategory === templateData.category._id
      );
      setSubCategories(subs);
    }
  }, [categories, templateData]);

  const parentCategories = categories.filter((cat) => !cat.parentCategory);

  const handleCategoryChange = (categoryId) => {
    setValue("category", categoryId);
    const subs = categories.filter((cat) => cat.parentCategory === categoryId);
    setSubCategories(subs);
    setValue("subCategory", "");
  };

  const handleTemplateSave = async (data) => {
    const userId = userObj?._id;

    if (!data.name || !data.category || !data.subCategory || !userId) {
      toast.error("All fields are required");
      return;
    }

    const jsonContent = JSON.stringify(fabricRef.current.toJSON());
    setLoader(true);
    if (isClone) {
      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${id}`,
          {
            name: data.name,
            category: data.category,
            subCategory: data.subCategory,
            content: jsonContent,
            user: userId,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        toast.success("Template clone successfully");
        router.push("/admin/template");
      } catch (err) {
        toast.error(
          err?.response?.data?.message || "Failed to update template"
        );
      } finally {
        setLoader(false);
      }
    } else {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${id}`,
          {
            name: data.name,
            category: data.category,
            subCategory: data.subCategory,
            content: jsonContent,
            user: userId,
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
        toast.error(
          err?.response?.data?.message || "Failed to update template"
        );
      } finally {
        setLoader(false);
      }
    }
  };

  return (
    <>
      <div id="main_container">
        <div className="inner_container">
          <div className="container-lg container-fluid p-0">
            <div className="comman_admin_layout flex-column p-0">
              <div className="container-lg container-fluid p-0">
                <div className="row mb-4">
                  <div className="col-lg-12 col-md-12 col-sm-12">
                    <div className="title_head">
                      <h1>Edit Template</h1>
                    </div>
                  </div>
                </div>
                <div className="admin_form_panel">
                  <form onSubmit={handleSubmit(handleTemplateSave)}>
                    <div className="row">
                      {/* Template Name */}
                      <div className="col-lg-6 col-md-6 col-12 mb-3">
                        <div className="form_group">
                          <label>
                            Template Name{" "}
                            <span className="text-danger"> *</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            {...register("name")}
                            value={watch("name")}
                            onChange={(e) => setValue("name", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div className="col-lg-6 col-md-6 col-12 mb-3">
                        <div className="form_group">
                          <label>
                            Category <span className="text-danger"> *</span>
                          </label>
                          <select
                            className="form-control"
                            value={watch("category")}
                            onChange={(e) =>
                              handleCategoryChange(e.target.value)
                            }
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

                      {/* Subcategory */}
                      <div className="col-lg-12 col-md-12 col-12 mb-3">
                        <div className="form_group">
                          <label>
                            Subcategory <span className="text-danger"> *</span>
                          </label>
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

                      {/* Fabric Editor */}
                      <div className="col-lg-12 col-md-12 col-12 mb-3 main-toolbar">
                        {/* <div className="form_group"> */}
                        <label className="pb-4">Template Editor</label>
                        <FabricTextEditorToolbar fRef={fabricRef} />
                        {/* </div> */}
                        <FabricToolbar fRef={fabricRef} />
                      </div>
                      <div className="col-lg-12 col-md-12 col-12 mb-3">
                        <canvas id="fabricCanvas" ref={canvasRef} />
                      </div>
                      {/* Action Buttons */}

                      <div className="col-12 mt-3 d-flex gap-3">
                        <button type="submit" className="button">
                          Save
                        </button>
                        {userObj?.role.name === "Super Admin" && (
                          <button
                            type="button"
                            className="button"
                            // style={{ backgroundColor: "#198754" }}
                            onClick={() => setApproveModel(true)}
                          >
                            Approve
                          </button>
                        )}
                        {userObj?.role.name === "Super Admin" && (
                          <button
                            type="button"
                            className="button"
                            // style={{ backgroundColor: "#dc3545" }}
                            onClick={() => setShowRejectModal(true)}
                          >
                            Reject
                          </button>
                        )}
                        <button
                          type="button"
                          className="button"
                          // style={{ backgroundColor: "#6c757d" }}
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
        </div>
        {loader && <Loader />}
      </div>
      <DeleteTemplate
        show={showRejectModal}
        data={id}
        onHide={() => setShowRejectModal(false)}
      />
      <ApproveTemplate
        show={approveModel}
        data={id}
        onHide={() => setApproveModel(false)}
      />
    </>
  );
}
