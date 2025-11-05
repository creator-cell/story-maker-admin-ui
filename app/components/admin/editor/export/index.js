"use client";

import { Button } from "@/app/components/ui/button";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { cn } from "../../lib/utils";
import { jsPDF } from "jspdf";

import { useEditorStore } from "../../../../redux/UserStore";
import {
  Download,
  File,
  FileIcon,
  FileImage,
  FileJson,
  Loader2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
function ExportModal({ isOpen, onClose }) {
  const { canvas } = useEditorStore();
  const { designId } = useEditorStore();
  console.log("designId", designId);
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE;
  const [templateData,setTemplateData]=useState("")
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const { t } = useTranslation();

  const exportFormats = [
    {
      id: "pdf",
      name: t("PDF Document"),
      icon: File,
      description: t("Best for printing"),
    },
    {
      id: "json",
      name: t("CSV File"),
      icon: FileJson,
      description: t("Editable template format"),
    },
  ];

  const increaseTemplateUsage = async () => {
    try {
      const res = await axios.post(
        `${API_URL}template/getUsage`,
        { templateId: designId },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log(res);
    } catch (err) {}
  };

  async function exportAsPDF(canvas, fileName = "PDF Design", options = {}) {
    if (!canvas) return;

    try {
      const defaultOptions = {
        format: "a4",
        orientation: "landscape",
        unit: "mm",
        ...options,
      };

      const pdf = new jsPDF(
        defaultOptions.orientation,
        defaultOptions.unit,
        defaultOptions.format
      );

      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const scale =
        Math.min(pdfWidth / canvasWidth, pdfHeight / canvasHeight) * 0.9; //90% available space

      const x = (pdfWidth - canvasWidth * scale) / 2;
      const y = (pdfHeight - canvasHeight * scale) / 2;

      const imgData = canvas.toDataURL("image/png", 1.0);

      pdf.addImage(
        imgData,
        "PNG",
        x,
        y,
        canvasWidth * scale,
        canvasHeight * scale
      );

      pdf.save(`${fileName}.pdf`);
      await increaseTemplateUsage();
      return true;
    } catch (e) {
      return false;
    }
  }
  const handleDownloadCSV = async (tpl, name) => {
    try {
      const rawData = tpl.content ?? tpl;
      const jsonData =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      if (!jsonData._objects?.length) {
        console.log("no object found");
        return false;
      }

      const allKeys = Array.from(
        new Set(jsonData._objects.flatMap((obj) => Object.keys(obj)))
      );

      const rows = jsonData._objects.map((obj) =>
        allKeys.map((key) => {
          let val = obj[key];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return JSON.stringify(val);
          return String(val).replace(/,/g, " ");
        })
      );

      const csv = [allKeys.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tpl.name || name || "template"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      await increaseTemplateUsage();
      return true;
    } catch (err) {
      console.error("CSV export error:", err);
      return false;
    }
  };

   const fetchTemplate = async (designId) => {
      // setLoader(true);
  
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${designId}`,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }
        );
        console.log("template data",res.data);
        setTemplateData(res.data)
        return res;
      } catch (err) {
        //toast.error("Failed to load template");
      } finally {
        setIsLoading(false);
      }
    };
useEffect(()=>{
  fetchTemplate();
},[designId])
  const handleExport = async () => {
    if (!canvas) return;
    setIsExporting(true);

    try {
      let successFlag = false;

      switch (selectedFormat) {
        case "json":
          successFlag = handleDownloadCSV(canvas, "JSON FileName");
          break;

        case "pdf":
          successFlag = exportAsPDF(canvas, "PDF FileName");
          break;

        default:
          break;
      }

      if (successFlag) {
        setTimeout(() => {
          onClose();
        }, 500);
      }
    } catch (e) {
      console.error("Export error:", e);
      //  toast.error("Export failed");
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader className="border-0">
          <DialogTitle>
            <small>{t("Export Design")}</small>
          </DialogTitle>
        </DialogHeader>

        <div className="mx-3">
          <h3 className="fs-6 fw-bold mb-3">
            <small>{t("Choose Format")}</small>
          </h3>
          <div className="d-flex gap-3">
            {exportFormats.map((exportFormat) => (
              <Card
                key={exportFormat.id}
                className={cn(
                  "w-50 rounded",
                  selectedFormat === exportFormat.id
                    ? "border-dark bg-accent rounded"
                    : "border-border"
                )}
                onClick={() => setSelectedFormat(exportFormat.id)}
              >
                <CardContent
                  className={
                    "p-4 d-flex flex-column align-items-center text-center"
                  }
                >
                  <exportFormat.icon
                    className={cn(
                      "mb-2",
                      selectedFormat === exportFormat.id ? "text-dark" : ""
                    )}
                  />
                  <h6 className="fs-6 fw-bold">
                    <small>{exportFormat.name}</small>
                  </h6>
                  <p className="fs-7">{exportFormat.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="text-white d-flex gap-3 rounded border-0"
            variant="default"
          >
            {isExporting ? (
              <>
                <Loader2 className="" />
                {t("Exporting...")}
              </>
            ) : (
              <>
                <Download className="" />
                {t("Export")} {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportModal;
