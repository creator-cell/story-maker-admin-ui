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
// import {
//   exportAsJson,
//   exportAsPDF,
//   exportAsPng,
//   exportAsSVG,
// } from "@/services/export-service";
import { useEditorStore } from "../../../../redux/UserStore";
import {
  Download,
  File,
  FileIcon,
  FileImage,
  FileJson,
  Loader2,
} from "lucide-react";
import { useState } from "react";

function ExportModal({ isOpen, onClose }) {
  const { canvas } = useEditorStore();
  console.log("export canvas", isOpen);
  const [selectedFormat, setSelectedFormat] = useState("pdf");
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF Document",
      icon: File,
      description: "Best for printing",
    },
    {
      id: "json",
      name: "JSON Template",
      icon: FileJson,
      description: "Editable template format",
    },
  ];

  const handleDownloadPDF = async (tpl, name) => {
    try {
      // load Fabric dynamically (Next.js client-side only)
      const fabricMod = await import("fabric");
      const fabric = fabricMod.fabric || fabricMod;

      const rawData = tpl?.content ?? tpl;
      const jsonData =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      if (!jsonData?.objects?.length && !jsonData?._objects?.length) {
        console.log("no object");
        return false;
      }

      const width = jsonData.width || 800;
      const height = jsonData.height || 600;

      // create offscreen canvas
      const el = document.createElement("canvas");
      el.width = width;
      el.height = height;

      const canvas = new fabric.StaticCanvas(el, { width, height });

      // load JSON into canvas
      await new Promise((resolve) => {
        canvas.loadFromJSON(jsonData, () => {
          canvas.renderAll(); // render objects
          resolve();
        });
      });

      const dataUrl = canvas.toDataURL({ format: "png", quality: 1 });

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF("l", "pt", [width, height]);
      pdf.addImage(dataUrl, "PNG", 0, 0, width, height);
      pdf.save(`${tpl.name || name || "template"}.pdf`);

      return true;
    } catch (err) {
      console.error("PDF export error:", err);
      return false;
    }
  };

  const handleDownloadCSV = (tpl, name) => {
    console.log("tpl input:", tpl);

    try {
      // Normalize data
      const rawData = tpl.content ?? tpl;
      const jsonData =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      console.log("parsed jsonData:", jsonData);

      if (!jsonData._objects?.length) {
        console.log("no object found");
        return false;
      }

      // Collect all unique keys
      const allKeys = Array.from(
        new Set(jsonData._objects.flatMap((obj) => Object.keys(obj)))
      );

      // Build CSV rows
      const rows = jsonData._objects.map((obj) =>
        allKeys.map((key) => {
          let val = obj[key];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return JSON.stringify(val);
          return String(val).replace(/,/g, " ");
        })
      );

      // Final CSV string
      const csv = [allKeys.join(","), ...rows.map((r) => r.join(","))].join(
        "\n"
      );

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tpl.name || name || "template"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;
    } catch (err) {
      console.error("CSV export error:", err);
      return false;
    }
  };

  const handleExport = async () => {
    if (!canvas) return;
    setIsExporting(true);

    try {
      let successFlag = false;

      switch (selectedFormat) {
        case "json":
          successFlag = handleDownloadCSV(canvas, "JSON FileName");
          break;

        // case "png":
        //   successFlag = exportAsPng(canvas, "PNG FileName");
        //   break;

        // case "svg":
        //   successFlag = exportAsSVG(canvas, "SVG FileName");
        //   break;

        case "pdf":
          successFlag = handleDownloadPDF(canvas, "PDF FileName");
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
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle className={"text-xl"}>Export Design</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <h3 className="text-xs font-medium mb-3">Choose Format</h3>
          <div className="grid grid-cols-2 gap-3">
            {exportFormats.map((exportFormat) => (
              <Card
                key={exportFormat.id}
                className={cn(
                  "cursor-pointer border transition-colors hover:bg-accent hover:text-accent-foreground",
                  selectedFormat === exportFormat.id
                    ? "border-primary bg-accent"
                    : "border-border"
                )}
                onClick={() => setSelectedFormat(exportFormat.id)}
              >
                <CardContent
                  className={"p-4 flex flex-col items-center text-center"}
                >
                  <exportFormat.icon
                    className={cn(
                      "h-8 w-8 mb-2",
                      selectedFormat === exportFormat.id
                        ? "text-primary"
                        : "text-muted-foreground"
                    )}
                  />
                  <h4 className="font-medium text-sm">{exportFormat.name}</h4>
                  <p className="mt-1 text-muted-foreground font-medium">
                    {exportFormat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="min-w-[120px] bg-purple-700 text-white"
            variant="default"
          >
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ExportModal;
