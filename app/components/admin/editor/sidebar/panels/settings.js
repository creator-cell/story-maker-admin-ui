"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Separator } from "@/app/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { colorPresets } from "@/app/components/admin/config/index";
import { centerCanvas } from "@/app/components/admin/fabric/fabric-utils";
import { useEditorStore } from "@/app/redux/UserStore";
import { Check, Palette } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

function SettingsPanel() {
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const { canvas, markAsModified } = useEditorStore();
  const { t } = useTranslation();

  const handleColorChange = (event) => {
    setBackgroundColor(event.target.value);
  };

  const handleColorPresetApply = (getCurrentColor) => {
    setBackgroundColor(getCurrentColor);
  };

  const handleApplyChanges = () => {
    if (!canvas) return;
    canvas.set("backgroundColor", backgroundColor);
    canvas.renderAll();

    centerCanvas(canvas);
    markAsModified();
  };

  return (
    <div className="p-4">
      <div className="d-flex align-item-center gap-1">
        <Palette className="pellete-icon"/>
        <h3 className="fs-6 fw-bold p-1">{t("Choose Background Color")}</h3>
      </div>
      <div className="mt-2">
        <div className="choose-color">
          {colorPresets.map((color) => (
            <TooltipProvider key={color}>
              <Tooltip>
                <TooltipTrigger asChild="true">
                  <button
                    className={`rounded border ${
                      color === backgroundColor
                        ? "ring-2 ring-offset-2 ring-primary"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorPresetApply(color)}
                  >
                    {color === backgroundColor && (
                      <Check className="text-white mx-auto" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{color}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>
        <div className="mt-3">
          <div className="setting-background d-flex flex-column position-relative gap-2">
            <Input
              type="color"
              value={backgroundColor}
              onChange={handleColorChange}
              className={"cursor-pointer rounded"}
            />
            <Input
              type={"text"}
              value={backgroundColor}
              onChange={handleColorChange}
              className="w-75 rounded mt-2"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
        <hr></hr>
        <Separator className="my-3" />
        <Button className="apply-btn w-100 text-white border-0 rounded" onClick={handleApplyChanges}>
          {t("Apply Changes")}
        </Button>
      </div>
    </div>
  );
}

export default SettingsPanel;
