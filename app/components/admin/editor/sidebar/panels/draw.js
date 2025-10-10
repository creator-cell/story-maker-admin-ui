"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Slider } from "@/app/components/ui/slider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/app/components/ui/tabs";

import {
  toggleDrawingMode,
  toggleEraseMode,
  updateDrawingBrush,
} from "./../../../fabric/fabric-utils";
import { useEditorStore } from "../../../../../redux/UserStore";
import {
  Droplets,
  EraserIcon,
  Minus,
  Paintbrush,
  Palette,
  PencilIcon,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { drawingPanelColorPresets, brushSizes } from "./../../../config/index";
import { useTranslation } from "react-i18next";

function DrawingPanel() {
  const { canvas } = useEditorStore();
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [drawingOpacity, setDrawingOpacity] = useState(100);
  const [activeTab, setActiveTab] = useState("colors");
  const { t } = useTranslation();

  const handleToggleDrawingMode = () => {
    if (!canvas) return;
    const newMode = !isDrawingMode;
    setIsDrawingMode(newMode);

    if (newMode && isErasing) {
      setIsErasing(false);
    }

    toggleDrawingMode(canvas, newMode, drawingColor, brushWidth);
  };

  const handleDrawingColorChange = (color) => {
    setDrawingColor(color);

    if (canvas && isDrawingMode && !isErasing) {
      updateDrawingBrush(canvas, { color });
    }
  };

  const handleBrushWidthChange = (width) => {
    setBrushWidth(width);
    if (canvas && isDrawingMode) {
      updateDrawingBrush(canvas, { width: isErasing ? width * 2 : width });
    }
  };

  const handleDrawingOpacityChange = (value) => {
    const opacity = Number(value[0]);
    setDrawingOpacity(opacity);
    if (canvas && isDrawingMode) {
      updateDrawingBrush(canvas, { opacity: opacity / 100 });
    }
  };

  const handleToggleErasing = () => {
    if (!canvas && !isDrawingMode) return;
    const newErasing = !isErasing;
    setIsErasing(newErasing);

    toggleEraseMode(canvas, newErasing, drawingColor, brushWidth * 2);
  };

  return (
    <div className="draw-button p-4">
      <div>
        <Button
          variant={isDrawingMode ? "default" : "outline"}
          className={
            "draw-btn w-100 py-2 rounded bg-transparent d-flex justify-content-center align-items-center gap-3"
          }
          size="lg"
          onClick={handleToggleDrawingMode}
        >
          <PencilIcon
            className={`pencil-icon ${
              isDrawingMode ? "animate-bounce" : "hover:animate-bounce"
            }`}
          />
          <span className="font-medium">
            {isDrawingMode ? t("Exit Drawing Mode") : t("Enter Drawing Mode")}
          </span>
        </Button>
        {isDrawingMode && (
          <>
            <Tabs
              defaultValue="colors"
              className={"w-100 mt-3"}
              value={activeTab}
              onValueChange={setActiveTab}
            >
              <TabsList className="tablist d-flex flex-col gap-2 w-100 mt-3">
                <TabsTrigger value="colors" className="rounded gap-1">
                  <Palette />
                  {t("Colors")}
                </TabsTrigger>
                <TabsTrigger value="brush" className="rounded gap-1">
                  <Paintbrush className="" />
                  {t("Brush")}
                </TabsTrigger>
                <TabsTrigger
                  value="tools"
                  className="rounded not-last-of-type:gap-1"
                >
                  <EraserIcon className="" />
                  {t("Tools")}
                </TabsTrigger>
              </TabsList>
              <TabsContent value="colors">
                <div className="mt-3">
                  <div className="color-pelet d-flex justify-content-between align-items-center">
                    <Label>{t("Color Palette")}</Label>
                    <div
                      className="rounded border"
                      style={{ backgroundColor: drawingColor }}
                    />
                  </div>
                  <div className="mt-2">
                    <div className="choose-color">
                      {drawingPanelColorPresets.map((color) => (
                        <div key={color}>
                          <button
                            className={`rounded border  ${
                              color === drawingColor
                                ? "ring-1 ring-offset-2 ring-primary"
                                : ""
                            }
                            `}
                            onClick={() => handleDrawingColorChange(color)}
                            style={{ backgroundColor: color }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="draw-main mt-4">
                    <div className="draw-background position-relative">
                      <Input
                        type="color"
                        value={drawingColor}
                        onChange={(e) =>
                          handleDrawingColorChange(e.target.value)
                        }
                        disabled={isErasing}
                      />
                    </div>
                    <Input
                      type="text"
                      value={drawingColor}
                      onChange={(e) => handleDrawingColorChange(e.target.value)}
                      className={"rounded mt-3"}
                      disabled={isErasing}
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="brush" className={"mt-2"}>
                <div className="brush">
                  <Label className={"block text-sm font-semibold"}>
                    {t("Brush Size")}
                  </Label>
                  <div className="d-flex align-items-center gap-2">
                    <Minus />
                    <input
                      type="range"
                      className="form-range flex-grow-1"
                      min="1"
                      max="30"
                      step="1"
                      value={brushWidth}
                      onChange={(e) => setBrushWidth(Number(e.target.value))}
                    />
                    <Plus />
                  </div>
                  <div className="mt-2 brush-size-button">
                    {brushSizes.map((size) => (
                      <Button
                        key={size.value}
                        variant={
                          size.value === brushWidth ? "default" : "outline"
                        }
                        className={"rounded bg-white border"}
                        onClick={() => handleBrushWidthChange(size.value)}
                      >
                        {size.label}
                      </Button>
                    ))}
                  </div>
                  {/* <div className="space-y-2 mt-4">
                    <div className="d-flex justify-content-between">
                      <label
                        for="opacity-slider"
                        className="form-label font-medium"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="mr-2 h-4 w-4"
                        >
                          <path d="M12 2v20M2 12h20M7 7l10 10M7 17l10-10" />
                        </svg>
                        Opacity
                      </label>
                      <span className="text-sm font-medium">
                        <span id="opacity-value">100</span>%
                      </span>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      id="opacity-slider"
                      min="1"
                      max="100"
                      step="1"
                      value="100"
                    />
                  </div> */}
                  <div className="space-y-2 mt-4">
                    <div className="d-flex justify-content-between">
                      <Label className={"font-medium"}>
                        <Droplets className="mr-2 h-4 w-4" />
                        {t("Opacity")}
                      </Label>
                      <span className="text-sm font-medium">
                        {drawingOpacity}%
                      </span>
                    </div>
                    <input
                      type="range"
                      className="form-range"
                      id="opacity-slider"
                      min="1"
                      max="100"
                      step="1"
                      value={drawingOpacity}
                      onChange={(e) =>
                        handleDrawingOpacityChange([Number(e.target.value)])
                      }
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tools" className={"tools mt-3 d-flex"}>
                <Button
                  onClick={handleToggleErasing}
                  variant={isErasing ? "destructive" : "outline"}
                  className={
                    "w-100 rounded bg-white p-2 d-flex align-items-center justify-content-center gap-2 text-dark"
                  }
                  size="lg"
                >
                  <EraserIcon />
                  {isErasing ? t("Stop Erasing") : t("Eraser mode")}
                </Button>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

export default DrawingPanel;
