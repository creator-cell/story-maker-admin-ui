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
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL_V1;
  const [templateData, setTemplateData] = useState("");
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

  async function exportAsPDF(data, fileName = "Usage Report") {
    if (!data) return;

    try {
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const margin = 15;
      const lineHeight = 10;
      let y = margin;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(16);
      pdf.text(fileName, margin, y);
      y += lineHeight * 1.5;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(12);

      // Prepare and flatten data
      const report = {
        "Template ID": data._id,
        "Template Name": data.name,
        "Template Count": data.templateCount,
        Status: data.status,
        "User ID": data.user?._id,
        "User Name": data.user?.name,
        "User Email": data.user?.email,
        "User Phone": data.user?.phone,
        "Email Verified": data.user?.emailVerified ? "Yes" : "No",
        "User Active": data.user?.isActive ? "Yes" : "No",
        "Created At": new Date(data.createdAt).toLocaleString(),
        "Updated At": new Date(data.updatedAt).toLocaleString(),
      };

      Object.entries(report).forEach(([key, value]) => {
        pdf.text(`${key}: ${value ?? "-"}`, margin, y);
        y += lineHeight;

        // Add new page if needed
        if (y > 280) {
          pdf.addPage();
          y = margin;
        }
      });

      pdf.save(`${fileName}.pdf`);
      await increaseTemplateUsage?.();
      return true;
    } catch (err) {
      console.error("PDF export error:", err);
      return false;
    }
  }

  const handleDownloadCSV = async (data, name) => {
    try {
      if (!data) {
        console.log("No data found");
        return false;
      }

      // Flatten user data for easy CSV conversion
      const report = {
        Template_ID: data._id,
        Template_Name: data.name,
        Template_Count: data.templateCount,
        Status: data.status,
        User_ID: data.user?._id,
        User_Name: data.user?.name,
        User_Email: data.user?.email,
        User_Phone: data.user?.phone,
        Email_Verified: data.user?.emailVerified ? "Yes" : "No",
        User_Active: data.user?.isActive ? "Yes" : "No",
        Created_At: new Date(data.createdAt).toLocaleString(),
        Updated_At: new Date(data.updatedAt).toLocaleString(),
      };

      const headers = Object.keys(report);
      const values = Object.values(report).map((val) =>
        typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val
      );

      const csv = [headers.join(","), values.join(",")].join("\n");

      // Create and trigger download
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${data.name || "usage-report"}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("CSV downloaded successfully");
      return true;
    } catch (err) {
      console.error("CSV export error:", err);
      return false;
    }
  };

  const fetchTemplate = async () => {
    // setLoader(true);

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}template/${designId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("template data", res.data);
      setTemplateData(res.data.template);
      return res;
    } catch (err) {
      //toast.error("Failed to load template");
    } finally {
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchTemplate();
  }, [designId]);
  const handleExport = async () => {
    if (!canvas) return;
    setIsExporting(true);

    try {
      let successFlag = false;

      switch (selectedFormat) {
        case "json":
          successFlag = handleDownloadCSV(templateData, "JSON FileName");
          break;

        case "pdf":
          successFlag = await exportAsPDF(templateData, "PDF FileName");
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
