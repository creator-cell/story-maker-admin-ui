"use client";

import { Button } from "@/app/components/ui/button";
import { textPresets } from "@/app/components/admin/config/index";
import { addTextToCanvas } from "@/app/components/admin/fabric/fabric-utils";
import { useEditorStore } from "@/app/redux/UserStore";
import { Type } from "lucide-react";
import { useTranslation } from "react-i18next";

function TextPanel() {
  const { canvas } = useEditorStore();
  const { t } = useTranslation();

  const handleAddCustomTextBox = () => {
    if (!canvas) return;

    addTextToCanvas(canvas, "Enter text here", { fontSize: 24 });
  };

  const handleAddPresetText = (currentPreset) => {
    if (!canvas) return;
    addTextToCanvas(canvas, currentPreset.text, currentPreset);
  };

  return (
    <div className="overflow-auto">
      <div className="p-4 mt-2">
        <div className="add-text-btn">
        <Button
          onClick={handleAddCustomTextBox}
          className="w-100 py-2 text-white rounded d-flex align-items-center justify-content-center border-0 gap-3"
        >
          <Type/>
          <span>{t("Add a text box")}</span>
        </Button>
        </div>
        <div className="pt-3">
          <h3 className="fs-6 fw-bold">
            {t("Default Text Styles")}
          </h3>
          <div className="mt-3 d-flex flex-column gap-3">
            {textPresets.map((preset, index) => (
              <button
                className="w-100 p-3 d-flex border rounded"
                key={index}
                onClick={() => handleAddPresetText(preset)}
                style={{
                  fontSize: `${Math.min(preset.fontSize / 1.8, 24)}px`,
                  fontWeight: preset.fontWeight,
                  fontStyle: preset.fontStyle || "normal",
                  fontFamily: preset.fontFamily,
                }}
              >
                {preset.text}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextPanel;
