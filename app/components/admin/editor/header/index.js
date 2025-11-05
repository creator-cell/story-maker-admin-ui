"use client";

import { Input } from "@/app/components/ui/input";
import { useEditorStore } from "../../../../redux/UserStore";
import axios from "axios";
import { Download, Loader2, Save } from "lucide-react";

import { useEffect, useState } from "react";
import ExportModal from "../export";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { Dropdown } from "bootstrap";
import { useTranslation } from "react-i18next";

function Header() {
  const {
    isEditing,
    setIsEditing,
    name,
    setName,
    canvas,
    saveStatus,
    markAsModified,
    designId,
    category,
    subCategory,
    userDesigns,
    userSubscription,
    setShowPremiumModal,
  } = useEditorStore();

  const [showExportModal, setShowExportModal] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [parentCategories, setParentCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const { t } = useTranslation();

  const fetchCategories = async () => {
    console.log("fetch cat");
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_CATEGORY}category`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const categoriesData = res.data.categories || [];
      console.log("cat data", categoriesData);
      setAllCategories(categoriesData);
      const parentCategories = res.data?.categories.filter(
        (cat) => !cat.parentCategory
      );
      console.log(parentCategories);
      setParentCategories(parentCategories || []);
      console.log(categoriesData);
      console.log(parentCategories);
    } catch {
      toast.error(t("Failed to fetch categories"));
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!canvas) return;
    canvas.selection = isEditing;
    canvas.getObjects().forEach((obj) => {
      obj.selectable = isEditing;
      obj.evented = isEditing;
    });
  }, [isEditing]);

  useEffect(() => {
    if (!canvas || !designId) return;
    markAsModified();
  }, [name, canvas, designId]);

  const handleExport = () => {
    setShowExportModal(true);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    const relatedSubCategories = allCategories.filter(
      (cat) => cat.parentCategory === category._id
    );
    setSubCategories(relatedSubCategories);
    setSelectedSubcategory(null);
  };

  const handleSubcategoryChange = (subcategory) => {
    setSelectedSubcategory(subcategory);
  };

  return (
    <header className="header-gradient header d-flex align-items-center justify-content-between px-4 h-14">
      <div className="d-flex align-items-center gap-2">
        <button
          className={
            "save position-relative d-flex align-items-center justify-content-center border-0 text-white"
          }
          title={saveStatus !== "Saving..." ? "Save" : saveStatus}
          disabled={saveStatus === "Saving..."}
        >
          {saveStatus === "Saving..." ? (
            <div className="relative flex items-center">
              <Loader2 className="h-5 w-5 animate-spin text-white" />
              <span className="sr-only">{t("Saving...")}</span>
            </div>
          ) : (
            <Save
              className={cn("h-5 w-5", saveStatus === "Saved" && "text-white")}
            />
          )}
          {saveStatus === "Saving..." && (
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
          )}
        </button>

        <button
          onClick={handleExport}
          className="header-export-button ml-3 relative"
          title="Export"
        >
          <Download className="w-5 h-5" />
        </button>
      </div>
      <div className="flex-1 d-flex justify-content-center mw-100">
        <Input
          className="search-input w-full text-white rounded-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </header>
  );
}

export default Header;
