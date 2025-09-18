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
  console.log("export canvas");
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: "png",
      name: "PNG Image",
      icon: FileImage,
      description: "Best for web and social media",
    },
    {
      id: "svg",
      name: "SVG Vector",
      icon: FileIcon,
      description: "Scalable vector format",
    },
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
  const handleDownloadPDF = (tpl) => {
    if (!tpl.content) {
      toast.error("No template data found");
      return;
    }

    // create a hidden canvas to render
    const canvas = new fabric.StaticCanvas(null, { width: 800, height: 600 });

    try {
      const jsonData =
        typeof tpl.content === "string" ? JSON.parse(tpl.content) : tpl.content;

      canvas.loadFromJSON(jsonData, () => {
        const dataUrl = canvas.toDataURL({ format: "png", quality: 1 });

        const pdf = new jsPDF("l", "pt", [canvas.width, canvas.height]);
        pdf.addImage(dataUrl, "PNG", 0, 0, canvas.width, canvas.height);
        pdf.save(`${tpl.name || "template"}.pdf`);
      });
    } catch (err) {
      toast.error("Error exporting PDF");
    }
  };
  const handleDownloadCSV = (tpl) => {
    if (!tpl.content) {
      toast.error("No template data found");
      return;
    }

    try {
      const jsonData =
        typeof tpl.content === "string" ? JSON.parse(tpl.content) : tpl.content;

      // flatten objects
      const rows = [];
      jsonData.objects.forEach((obj) => {
        rows.push({
          type: obj.type,
          text: obj.text || "",
          left: obj.left,
          top: obj.top,
          width: obj.width,
          height: obj.height,
          fill: obj.fill,
          stroke: obj.stroke,
          fontSize: obj.fontSize,
          fontFamily: obj.fontFamily,
        });
      });

      // convert to CSV
      const headers = Object.keys(rows[0]).join(",");
      const csv = [
        headers,
        ...rows.map((r) => Object.values(r).join(",")),
      ].join("\n");

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${tpl.name || "template"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Error exporting CSV");
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
      throw new Error("Export failed");
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
