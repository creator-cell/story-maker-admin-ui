"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Loader from "../../components/Loader";
import FabricToolbar from "./FabricToolBar";
import { setupCustomControls } from "./canvas/CustomControls";
import { initCanvas } from "./canvas/InitShapes";
import { addShape } from "./canvas/AddShapes";
import { addLine } from "./canvas/AddLines";

import { addStickyNote } from "./canvas/AddStickyNotes";
import { addTable } from "./canvas/AddTable";
import { enableErase, setDrawingMode } from "./canvas/DrawingTools";
import { onUploadImage } from "./canvas/ImageTools";
import FabricTextEditorToolbar from "./canvas/FabricTextEditorToolbar";
import axios from "axios";
import Categories from "./Category";

export default function AddTemplatePage() {
  const [loader, setLoader] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedObject, setSelectedObject] = useState(null);

  const fRef = useRef(null);
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const router = useRouter();

  const selectOptions = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  const {
    handleSubmit,
    register,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { name: "", category: "", subCategory: "", content: "" },
  });

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}category`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setCategories(res.data.categories || []);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  // const initCanvas = () => {
  //   if (!canvasRef.current) return;
  //   const canvas = new fabric.Canvas(canvasRef.current, {
  //     width: 800,
  //     height: 500,
  //     backgroundColor: "#fff",
  //     selection: true,
  //     preserveObjectStacking: true,
  //   });
  //   fRef.current = canvas;
  //   // const starter = new fabric.IText("Double-click to edit", {
  //   //   left: 80,
  //   //   top: 80,
  //   //   fontSize: 28,
  //   // });
  //   // canvas.add(starter).setActiveObject(starter);

  //   canvas.on("selection:created", (e) => {
  //     const obj = e.target || (e.selected && e.selected[0]);
  //     setSelectedObject(obj);
  //   });
  //   canvas.on("selection:updated", (e) => {
  //     const obj = e.target || (e.selected && e.selected[0]);
  //     setSelectedObject(obj);
  //   });
  //   canvas.on("selection:cleared", () => {
  //     setSelectedObject(null);
  //   });

  //   const resize = () => {
  //     if (!wrapRef.current) return;
  //     const w = wrapRef.current.clientWidth;
  //     const h = Math.max(420, Math.round((w * 9) / 16));
  //     canvas.setWidth(w);
  //     canvas.setHeight(h);
  //     canvas.renderAll();
  //   };
  //   resize();
  //   window.addEventListener("resize", resize);

  //   return () => {
  //     window.removeEventListener("resize", resize);
  //     canvas.dispose();
  //   };
  // };

  useEffect(() => {
    initCanvas(canvasRef, wrapRef, fRef, setSelectedObject);
    console.log("Canvas initialized:", fRef.current);

    fetchCategories(setCategories);
  }, [fRef]);

  const handleCategoryChange = (id) => {
    setValue("category", id);
    setSubCategories(categories.filter((c) => c.parentCategory === id));
    setValue("subCategory", "");
  };

  const handleTemplateSubmit = (data) => {
    const f = fRef.current;
    if (!f) return;
    const json = JSON.stringify(f.toJSON());
    setValue("content", json);

    setLoader(true);
    axios
      .post(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}template`,
        { ...data, content: json, status: "pending" },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      .then(() => {
        toast.success("Template added successfully");
        reset();
        router.push("/admin/template");
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || "Failed to add template");
      })
      .finally(() => setLoader(false));
  };

  const parentCategories = categories.filter((cat) => !cat.parentCategory);

  const handleSelectMenuChange = (value) => {
    setSelectedOption(value);
    toast.info(`Selected: ${value}`);
  };

  const addText = () => {
    const f = fRef.current;
    if (!f) return;

    const text = new fabric.IText("Edit me", {
      left: 120,
      top: 120,
      fontSize: 28,
      fill: "#111",
      id: `text-${Date.now()}`,
    });

    f.add(text).setActiveObject(text).renderAll();
  };

  return (
    <div id="main_container">
      <div className="inner_container">
        <div className="container-lg container-fluid p-0">
          <div className="comman_admin_layout flex-column p-0">
            <div className="row mb-4 w-100">
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="title_head">
                  <h3>Add Template</h3>
                </div>
              </div>
            </div>
            <div className="admin_form_panel pe-4">
              {loader && <Loader />}
              <form onSubmit={handleSubmit(handleTemplateSubmit)}>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="form_group">
                      <label>
                        Template Name <span className="text-danger"> *</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        {...register("name", {
                          required: "Template name is required",
                        })}
                      />
                      {errors.name && <small>{errors.name.message}</small>}
                    </div>
                  </div>

                  <div className="col-lg-6 col-md-6 col-12 mb-3">
                    <div className="form_group">
                      <label>
                        Category <span className="text-danger"> *</span>
                      </label>
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
                      {errors.category && (
                        <small>{errors.category.message}</small>
                      )}
                    </div>
                  </div>
                  {/* Subcategory Dropdown */}
                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <div className="form_group">
                      <label>
                        Subcategory <span className="text-danger"> *</span>
                      </label>
                      <select
                        className="form-control"
                        {...register("subCategory", {
                          required: "Subcategory is required",
                        })}
                      >
                        <option value="">Select Subcategory</option>
                        {subCategories.map((sub) => (
                          <option key={sub._id} value={sub._id}>
                            {sub.name}
                          </option>
                        ))}
                      </select>
                      {errors.subCategory && (
                        <small>{errors.subCategory.message}</small>
                      )}
                    </div>
                  </div>

                  <div className="col-lg-12 col-md-12 col-12 mb-3 main-toolbar">
                    <FabricTextEditorToolbar fRef={fRef} />

                    <FabricToolbar
                      onAddShape={(type) => addShape(fRef, type)}
                      onAddText={addText}
                      onAddLine={(type) => addLine(fRef, type)}
                      onAddStickyNote={(type) => addStickyNote(fRef, type)}
                      onAddTable={() => addTable(fRef)}
                      onErase={() => enableErase(fRef)}
                      onUpload={(file) => onUploadImage(fRef, file)}
                      onDraw={(tool, color) =>
                        setDrawingMode(fRef, tool, color)
                      }
                      onSelectMenuChange={handleSelectMenuChange}
                      selectOptions={selectOptions}
                      selectValue={selectedOption}
                    />
                  </div>

                  <div className="col-lg-12 col-md-12 col-12 mb-3">
                    <div ref={wrapRef} style={{ border: "1px solid #ccc" }}>
                      <canvas ref={canvasRef} />
                    </div>
                  </div>

                  <div className="col-12 mt-3 d-flex" style={{ gap: "20px" }}>
                    <button type="submit" className="button">
                      Submit
                    </button>
                    <button
                      type="button"
                      className="button"
                      style={{ backgroundColor: "#6c757d" }}
                      onClick={() => {
                        setLoader(true);
                        router.push("/admin/template");
                      }}
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
  );
}
