"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Slider } from "@/app/components/ui/slider";
import { Textarea } from "@/app/components/ui/textarea";
import { fontFamilies } from "../../config";
import {
  cloneSelectedObject,
  deletedSelectedObject,
} from "./../../fabric/fabric-utils";
import { useEditorStore } from "../../../../redux/UserStore";
import {
  Bold,
  Copy,
  FlipHorizontal,
  FlipVertical,
  Italic,
  MoveDown,
  MoveUp,
  Trash,
  Underline,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

//all states one by one -> reason for tutorial ->

function Properties() {
  const { canvas, markAsModified } = useEditorStore();
  //active object
  const [selectedObject, setSelectedObject] = useState(null);
  const [objectType, setObjectType] = useState("");

  //common
  const [opacity, setOpacity] = useState(100);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  //text
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(24);
  const [fontFamily, setFontFamily] = useState("Arial");
  const [fontWeight, setFontWeight] = useState("normal");
  const [fontStyle, setFontStyle] = useState("normal");
  const [underline, setUnderline] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [textBackgroundColor, setTextBackgroundColor] = useState("");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const { t } = useTranslation();
  const [fillColor, setFillColor] = useState("#ffffff");
  const [borderColor, setBorderColor] = useState("#000000");
  const [borderWidth, setBorderWidth] = useState(0);
  const [borderStyle, setBorderStyle] = useState("solid");

  const [filter, setFilter] = useState("none");
  const [blur, setBlur] = useState(0);

  useEffect(() => {
    if (!canvas) return;
    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();

      if (activeObject) {
        setSelectedObject(activeObject);

        setOpacity(Math.round(activeObject.opacity * 100) || 100);
        setWidth(Math.round(activeObject.width * activeObject.scaleX));
        setHeight(Math.round(activeObject.height * activeObject.scaleY));
        setBorderColor(activeObject.stroke || "#000000");
        setBorderWidth(activeObject.strokeWidth || 0);

        if (activeObject.type === "i-text") {
          setObjectType("text");

          setText(activeObject.text || "");
          setFontSize(activeObject.fontSize || 24);
          setFontFamily(activeObject.fontFamily || "Arial");
          setFontWeight(activeObject.fontWeight || "normal");
          setFontStyle(activeObject.fontStyle || "normal");
          setUnderline(activeObject.underline || false);
          setTextColor(activeObject.fill || "#000000");
          setTextBackgroundColor(activeObject.backgroundColor || "");
          setLetterSpacing(activeObject.charSpacing || 0);
        } else if (activeObject.type === "image") {
          setObjectType("image");

          if (activeObject.filters && activeObject.filters.length > 0) {
            const filterObj = activeObject.filters[0];
            if (filterObj.type === "Grayscale") setFilter("grayscale");
            else if (filterObj.type === "Sepia") setFilter("sepia");
            else if (filterObj.type === "Invert") setFilter("invert");
            else if (filterObj.type === "Blur") {
              setFilter("blur");
              setBlur(filterObj.blur * 100 || 0);
            } else setFilter("none");
          }

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        } else if (activeObject.type === "path") {
          setObjectType("path");

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        } else {
          setObjectType("shape");

          if (activeObject.fill && typeof activeObject.fill === "string") {
            setFillColor(activeObject.fill);
          }

          if (activeObject.strokeDashArray) {
            if (
              activeObject.strokeDashArray[0] === 5 &&
              activeObject.strokeDashArray[1] === 5
            ) {
              setBorderStyle("dashed");
            } else if (
              activeObject.strokeDashArray[0] === 2 &&
              activeObject.strokeDashArray[1] === 2
            ) {
              setBorderStyle("dotted");
            } else {
              setBorderStyle("solid");
            }
          }
        }
      }
    };

    const handleSelectionCleared = () => {};

    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      handleSelectionCreated();
    }

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("object:modified", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("object:modified", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);

  const updateObjectProperty = (property, value) => {
    if (!canvas || !selectedObject) return;

    selectedObject.set(property, value);
    canvas.renderAll();
    markAsModified();
  };

  //opacity
  const handleOpacityChange = (value) => {
    const newValue = Number(value[0]);
    setOpacity(newValue);
    updateObjectProperty("opacity", newValue / 100);
  };

  //duplicate
  const handleDuplicate = async () => {
    if (!canvas || !selectedObject) return;
    await cloneSelectedObject(canvas);
    markAsModified();
  };

  //delete
  const handleDelete = () => {
    if (!canvas || !selectedObject) return;
    deletedSelectedObject(canvas);
    markAsModified();
  };

  //arrangements
  const handleBringToFront = () => {
    if (!canvas || !selectedObject) return;
    canvas.bringObjectToFront(selectedObject);
    canvas.renderAll();
    markAsModified();
  };

  const handleSendToBack = () => {
    if (!canvas || !selectedObject) return;
    canvas.sendObjectToBack(selectedObject);
    canvas.renderAll();
    markAsModified();
  };

  //Flip H and Flip V

  const handleFlipHorizontal = () => {
    if (!canvas || !selectedObject) return;
    const flipX = !selectedObject.flipX;
    updateObjectProperty("flipX", flipX);
  };

  const handleFlipVertical = () => {
    if (!canvas || !selectedObject) return;
    const flipY = !selectedObject.flipY;
    updateObjectProperty("flipY", flipY);
  };

  const handleTextChange = (event) => {
    const newText = event.target.value;
    setText(newText);
    updateObjectProperty("text", newText);
  };

  const handleFontSizeChange = (e) => {
    const newSize = Number(e.target.value);
    setFontSize(newSize);
    updateObjectProperty("fontSize", newSize);
  };

  const handleFontFamilyChange = (value) => {
    setFontFamily(value);
    updateObjectProperty("fontFamily", value);
  };

  const handleToggleBold = () => {
    const newWeight = fontWeight === "bold" ? "normal" : "bold";
    setFontWeight(newWeight);
    updateObjectProperty("fontWeight", newWeight);
  };

  const handleToggleItalic = () => {
    const newStyle = fontStyle === "italic" ? "normal" : "italic";
    setFontStyle(newStyle);
    updateObjectProperty("fontStyle", newStyle);
  };

  const handleToggleUnderline = () => {
    const newUnderline = !underline;
    setUnderline(newUnderline);
    updateObjectProperty("underline", newUnderline);
  };

  const handleToggleTextColorChange = (e) => {
    const newTextColor = e.target.value;
    setTextColor(newTextColor);
    updateObjectProperty("fill", newTextColor);
  };

  const handleToggleTextBackgroundColorChange = (e) => {
    const newTextBgColor = e.target.value;
    setTextBackgroundColor(newTextBgColor);
    updateObjectProperty("backgroundColor", newTextBgColor);
  };

  const handleLetterSpacingChange = (value) => {
    const newSpacing = value[0];
    setLetterSpacing(newSpacing);
    updateObjectProperty("charSpacing", newSpacing);
  };

  const handleFillColorChange = (event) => {
    const newFillColor = event.target.value;
    setFillColor(newFillColor);
    updateObjectProperty("fill", newFillColor);
  };

  const handleBorderColorChange = (event) => {
    const newBorderColor = event.target.value;
    setBorderColor(newBorderColor);
    updateObjectProperty("stroke", newBorderColor);
  };

  const handleBorderWidthChange = (value) => {
    const newBorderWidth = value[0];
    setBorderWidth(newBorderWidth);
    updateObjectProperty("strokeWidth", newBorderWidth);
  };

  const handleBorderStyleChange = (value) => {
    setBorderStyle(value);

    let strokeDashArray = null;

    if (value === "dashed") {
      strokeDashArray = [5, 5];
    } else if (value === "dotted") {
      strokeDashArray = [2, 2];
    }

    updateObjectProperty("strokeDashArray", strokeDashArray);
  };

  const handleImageFilterChange = async (value) => {
    setFilter(value);

    if (!canvas || !selectedObject || selectedObject.type !== "image") return;
    try {
      canvas.discardActiveObject();

      const { filters } = await import("fabric");

      selectedObject.filters = [];

      switch (value) {
        case "grayscale":
          selectedObject.filters.push(new filters.Grayscale());

          break;
        case "sepia":
          selectedObject.filters.push(new filters.Sepia());

          break;
        case "invert":
          selectedObject.filters.push(new filters.Invert());

          break;
        case "blur":
          selectedObject.filters.push(new filters.Blur({ blur: blur / 100 }));

          break;
        case "none":
        default:
          break;
      }

      selectedObject.applyFilters();

      canvas.setActiveObject(selectedObject);
      canvas.renderAll();
      markAsModified();
    } catch (e) {
      console.error("Failed to apply filters");
    }
  };

  const handleBlurChange = async (value) => {
    const newBlurValue = value[0];
    setBlur(newBlurValue);

    if (
      !canvas ||
      !selectedObject ||
      selectedObject.type !== "image" ||
      filter !== "blur"
    )
      return;

    try {
      const { filters } = await import("fabric");

      selectedObject.filters = [new filters.Blur({ blur: newBlurValue / 100 })];
      selectedObject.applyFilters();
      canvas.renderAll();
      markAsModified();
    } catch (error) {
      console.error("Error while applying blur !", e);
    }
  };
  return (
    <>
      <div className="properties">
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <div className="d-flex align-items-center justify-content-between gap-2">
            <span className="font-medium">{t("Properties")}</span>
          </div>
        </div>
        <div className="overflow-auto p-4">
          <h3 className="fs-6 fw-bold">{t("Size & Position")}</h3>
          {/* Width & Height */}
          <div className="height-and-width d-flex gap-3 pt-2 cursor-pointer">
            {/* Width */}
            <div className="w-50 d-flex flex-column gap-1">
              <Label>
                <small>{t("Width")}</small>
              </Label>
              <Input
                type="number"
                value={width}
                onChange={(e) => {
                  const newWidth = Number(e.target.value);
                  setWidth(newWidth);
                  if (selectedObject) {
                    selectedObject.set(
                      "scaleX",
                      newWidth / selectedObject.width
                    );
                    canvas.renderAll();
                    markAsModified();
                  }
                }}
                className="px-3 py-2 border rounded"
              />
            </div>

            {/* Height */}
            <div className="w-50 d-flex flex-column gap-1">
              <Label>
                <small>{t("Height")}</small>
              </Label>
              <Input
                type="number"
                value={height}
                onChange={(e) => {
                  const newHeight = Number(e.target.value);
                  setHeight(newHeight);
                  if (selectedObject) {
                    selectedObject.set(
                      "scaleY",
                      newHeight / selectedObject.height
                    );
                    canvas.renderAll();
                    markAsModified();
                  }
                }}
                className="px-3 py-2 border rounded"
              />
            </div>
          </div>

          {/* Opacity */}
          <div className="mt-1">
            {/* Top row: Opacity label + percentage */}
            <div className="d-flex justify-content-between align-items-center pb-1">
              <label htmlFor="opacity" className="mb-0">
                <small>{t("Opacity")}</small>
              </label>
              <span>{opacity}%</span>
            </div>

            {/* Slider */}
            <input
              id="opacity"
              type="range"
              className="form-range custom-opacity"
              min="0"
              max="100"
              step="1"
              value={opacity}
              onChange={(e) => handleOpacityChange([Number(e.target.value)])}
            />
          </div>

          {/* Flip H, Flip V */}
          <div className="flip-h d-flex gap-2 mt-5 pb-2">
            <Button onClick={handleFlipHorizontal} variant={"outline"}>
              <FlipHorizontal />
              <Label>
                <small className="d-flex">{t("Flip H")}</small>
              </Label>
            </Button>
            <Button variant={"outline"} onClick={handleFlipVertical}>
              <FlipVertical />
              <Label>
                <small className="d-flex">{t("Flip V")}</small>
              </Label>
            </Button>
          </div>
          <hr></hr>

          {/* Arrangement */}
          <div className="pt-2 pb-2">
            <h3 className="fs-6 fw-bold">{t("Layer Position")}</h3>
            <div className="arrangement d-flex gap-2 pt-3">
              <Button onClick={handleBringToFront} variant={"outline"}>
                <Label>
                  <small className="d-flex">
                    <MoveUp />
                    {t("Bring to front")}
                  </small>
                </Label>
              </Button>
              <Button onClick={handleSendToBack} variant={"outline"}>
                <Label>
                  <small className="d-flex">
                    <MoveDown />
                    {t("Send to back")}
                  </small>
                </Label>
              </Button>
            </div>
          </div>
          <hr></hr>

          {/* Duplicate and delete */}
          <div className="pt-2 pb-2">
            <h3 className="fs-6 fw-bold">{t("Duplicate and Delete")}</h3>
            <div className="delete-update d-flex gap-2 pt-3">
              <Button
                className={"duplicate"}
                onClick={handleDuplicate}
                variant={"default"}
              >
                <Label>
                  <small className="d-flex gap-2">
                    <Copy />
                    {t("Duplicate")}
                  </small>
                </Label>
              </Button>
              <Button
                className={"delete"}
                onClick={handleDelete}
                variant={"destructive"}
              >
                <Label>
                  <small className="d-flex gap-2">
                    <Trash />
                    {t("Delete")}
                  </small>
                </Label>
              </Button>
            </div>
          </div>
          <hr></hr>

          {/* Text related properties */}
          {objectType === "text" && (
            <div className="pt-2 pb-2">
              <h3 className="fs-6 fw-bold">{t("Text Properties")}</h3>
              <div className="d-flex flex-column gap-1 pt-2 pb-2">
                <Label htmlFor="text-content">
                  <small>{t("Text Content")}</small>
                </Label>
                <Textarea
                  id="text-content"
                  value={text}
                  onChange={handleTextChange}
                  className={"rounded"}
                />
              </div>
              <div className="pt-2 pb-2">
                <div className="d-flex flex-column gap-1">
                  <Label htmlFor="font-size">
                    <small>{t("Font Size")}</small>
                  </Label>
                  <Input
                    id="font-size"
                    value={fontSize}
                    onChange={(e) => handleFontSizeChange(e)}
                    className={"w-25 rounded"}
                    type={"number"}
                  />
                </div>
              </div>
              <div className="pt-2">
                <div className="font-family d-flex flex-column gap-1 pb-2">
                  <label htmlFor="font-family" className="form-label">
                    <small>{t("Font family")}</small>
                  </label>
                  <select
                    id="font-family"
                    className="form-select rounded"
                    value={fontFamily}
                    onChange={(e) => handleFontFamilyChange(e.target.value)}
                  >
                    <option disabled value="">
                      {t("Select Font")}
                    </option>
                    {fontFamilies.map((fontItem) => (
                      <option
                        key={fontItem}
                        value={fontItem}
                        style={{ fontFamily: fontItem }}
                      >
                        {fontItem}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="pt-2">
                <div className="d-flex flex-column gap-1 pb-2">
                  <Label>
                    <small>{t("Style")}</small>
                  </Label>
                  <div className="styles d-flex gap-2">
                    <Button
                      variant={fontWeight === "bold" ? "default" : "outline"}
                      size="icon"
                      onClick={handleToggleBold}
                      className={"rounded"}
                    >
                      <Bold />
                    </Button>
                    <Button
                      variant={fontStyle === "italic" ? "default" : "outline"}
                      size="icon"
                      onClick={handleToggleItalic}
                      className={"rounded"}
                    >
                      <Italic />
                    </Button>
                    <Button
                      variant={underline ? "default" : "outline"}
                      size="icon"
                      onClick={handleToggleUnderline}
                      className={"rounded"}
                    >
                      <Underline />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="textbg-color d-flex justify-content-between mt-2">
                <div className="d-flex flex-column gap-1 pb-2">
                  <Label htmlFor="text-color">
                    <small>{t("Text Color")}</small>
                  </Label>
                  <div className="text-color position-relative overflow-hidden rounded border">
                    <div
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                      style={{ backgroundColor: textColor }}
                    />
                    <Input
                      id="text-color"
                      type="color"
                      value={textColor}
                      onChange={handleToggleTextColorChange}
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                    />
                  </div>
                </div>
                <div className="d-flex flex-column gap-1 pb-2">
                  <Label htmlFor="text-bg-color">
                    <small>{t("Text BG Color")}</small>
                  </Label>
                  <div className="bg-color position-relative overflow-hidden rounded border">
                    <div
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                      style={{ backgroundColor: textBackgroundColor }}
                    />
                    <Input
                      id="text-bg-color"
                      type="color"
                      value={textBackgroundColor}
                      onChange={handleToggleTextBackgroundColorChange}
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className="d-flex justify-content-between">
                  <label htmlFor="letter-spacing">
                    <small>{t("Letter Spacing")}</small>
                  </label>
                  <small>{letterSpacing}</small>
                </div>
                <input
                  id="letter-spacing"
                  type="range"
                  className="form-range"
                  min="-200"
                  max="800"
                  step="10"
                  value={letterSpacing}
                  onChange={(e) =>
                    handleLetterSpacingChange([Number(e.target.value)])
                  }
                />
              </div>
            </div>
          )}

          {objectType === "shape" && (
            <div className="mt-2">
              <h3 className="fs-6 fw-bold">{t("Shape Properties")}</h3>
              <div className="shape-properties d-flex justify-content-between">
                <div className="d-flex flex-column gap-1 pb-2">
                  <Label htmlFor="fill-color">
                    <small>{t("Fill Color")}</small>
                  </Label>
                  <div className="fill-color position-relative overflow-hidden rounded border">
                    <div
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                      style={{ backgroundColor: fillColor }}
                    />
                    <Input
                      id="fill-color"
                      type="color"
                      value={fillColor}
                      onChange={handleFillColorChange}
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                    />
                  </div>
                </div>
                <div className="d-flex flex-column gap-1 pb-2">
                  <Label htmlFor="border-color">
                    <small>{t("Border Color")}</small>
                  </Label>
                  <div className="border-color position-relative overflow-hidden rounded border">
                    <div
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                      style={{ backgroundColor: borderColor }}
                    />
                    <Input
                      id="fill-color"
                      type="color"
                      value={borderColor}
                      onChange={handleBorderColorChange}
                      className="position-absolute top-0 start-0 bottom-0 end-0"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <div className="d-flex justify-content-between mb-1">
                  <Label htmlFor="border-width">
                    <small>{t("Border Width")}</small>
                  </Label>
                  <span>{borderWidth}</span>
                </div>
                <input
                  id="border-width"
                  type="range"
                  className="form-range"
                  min="0"
                  max="20"
                  step="1"
                  value={borderWidth}
                  onChange={(e) =>
                    handleBorderWidthChange([Number(e.target.value)])
                  }
                />
              </div>

              <div className="mt-4">
                <div className="border-style d-flex flex-column gap-1 pb-2">
                  <label htmlFor="border-style" className="form-label">
                    <small>{t("Border Style")}</small>
                  </label>
                  <select
                    id="border-style"
                    className="form-select rounded"
                    value={borderStyle}
                    onChange={(e) => handleBorderStyleChange(e.target.value)}
                  >
                    <option value="solid">{t("Solid")}</option>
                    <option value="dashed">{t("Dashed")}</option>
                    <option value="dotted">{t("Dotted")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {objectType === "image" && (
            <div className="space-y-4 p-4 border-t">
              <h3 className="text-sm font-medium">{t("Image Properties")}</h3>
              <div className="space-y-2">
                <label htmlFor="border-color" className="text-xs">
                  {t("Border Color")}
                </label>
                <div className="relative w-8 h-8 overflow-hidden rounded-md border">
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: borderColor }}
                  />
                  <Input
                    id="fill-color"
                    type="color"
                    value={borderColor}
                    onChange={handleBorderColorChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="d-flex justify-content-between mb-1">
                  <label htmlFor="border-width" className="text-xs">
                    {t("Border Width")}
                  </label>
                  <span>{borderWidth}%</span>
                </div>
                <input
                  id="border-width"
                  type="range"
                  className="form-range"
                  min="0"
                  max="20"
                  step="1"
                  value={borderWidth}
                  onChange={(e) =>
                    handleBorderWidthChange([Number(e.target.value)])
                  }
                />
              </div>
              <div className="mt-2">
                <label htmlFor="border-style" className="form-label">
                  <small>{t("Border Style")}</small>
                </label>
                <select
                  id="border-style"
                  className="form-select rounded"
                  value={borderStyle}
                  onChange={(e) => handleBorderStyleChange(e.target.value)}
                >
                  <option value="solid">{t("Solid")}</option>
                  <option value="dashed">{t("Dashed")}</option>
                  <option value="dotted">{t("Dotted")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="filter" className="text-xs">
                  {t("Filter")}
                </label>
                <select
                  id="filter"
                  className="form-select h-10"
                  value={filter}
                  onChange={(e) => handleImageFilterChange(e.target.value)}
                >
                  <option value="none">{t("None")}</option>
                  <option value="grayscale">{t("Grayscale")}</option>
                  <option value="sepia">{t("Sepia")}</option>
                  <option value="invert">{t("Invert")}</option>
                  <option value="blur">{t("Blur")}</option>
                </select>
              </div>
              {filter === "blur" && (
                <div className="mt-2">
                  <div className="flex justify-between mb-4">
                    <label htmlFor="blur" className="text-xs">
                      {t("Blur Amount")}
                    </label>
                    <span>{blur}%</span>
                  </div>
                  <input
                    id="blur"
                    type="range"
                    className="form-range"
                    min="0"
                    max="100"
                    step="1"
                    value={blur}
                    onChange={(e) => handleBlurChange([Number(e.target.value)])}
                  />
                </div>
              )}
            </div>
          )}

          {objectType === "path" && (
            <div className="mt-2">
              <h3 className="fs-6 fw-bold">Path Properties</h3>
              <div className="space-y-2">
                <label htmlFor="border-color" className="form-label">
                  <small>{t("Border Color")}</small>
                </label>
                <div className="path-border-color position-relative overflow-hidden rounded border">
                  <div
                    className="position-absolute top-0 start-0 bottom-0 end-0"
                    style={{ backgroundColor: borderColor }}
                  />
                  <Input
                    id="fill-color"
                    type="color"
                    value={borderColor}
                    onChange={handleBorderColorChange}
                    className="position-absolute top-0 start-0 bottom-0 end-0"
                  />
                </div>
              </div>
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-1">
                  <label htmlFor="border-width" className="form-label">
                    <small>{t("Border Width")}</small>
                  </label>
                  <span>{borderWidth}</span>
                </div>
                <input
                  id="border-width"
                  type="range"
                  className="form-range"
                  min="0"
                  max="20"
                  step="1"
                  value={borderWidth}
                  onChange={(e) =>
                    handleBorderWidthChange([Number(e.target.value)])
                  }
                />
              </div>
              <div className="mt-4">
                <div className="border-style d-flex flex-column gap-1 pb-2">
                  <label htmlFor="border-style" className="form-label">
                    <small>{t("Border Style")}</small>
                  </label>
                  <select
                    id="border-style"
                    className="form-select rounded"
                    value={borderStyle}
                    onChange={(e) => handleBorderStyleChange(e.target.value)}
                  >
                    <option value="solid">{t("Solid")}</option>
                    <option value="dashed">{t("Dashed")}</option>
                    <option value="dotted">{t("Dotted")}</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Properties;
