"use client";

import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { addImageToCanvas } from "./../../../fabric/fabric-utils";
//import { fetchWithAuth } from "@/services/base-service";
//import { uploadFileWithAuth } from "@/services/upload-service";
import axios from "axios";
import { useEditorStore } from "../../../../../redux/UserStore";
import { Loader2, Upload } from "lucide-react";
import { toast } from "react-toastify";
// import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function UploadPanel() {
  const { canvas } = useEditorStore();
  const { t } = useTranslation();

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userUploads, setUserUploads] = useState([]);

  // const { data: session, status } = useSession();
  const fetchUserUploads = useCallback(async () => {
    try {
      setIsLoading(true);

      let url = `${process.env.NEXT_PUBLIC_SERVER_URL_ASSETS}assets?page=1&pageSize=20`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const items = response.data?.data?.assets?.items ?? [];

      const myItems = items.filter(
        (asset) => String(asset.uploadedBy?._id) === String(currentUser._id)
      );

      setUserUploads(myItems);
    } catch (error) {
      console.error("Error fetching assets:", error);
      toast.error("Failed to fetch assets");
      setUserUploads([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?._id]);

  useEffect(() => {
    fetchUserUploads();
  }, [fetchUserUploads]);
  const handleAddAssets = async (file) => {
    setIsLoading(true);

    if (!file) {
      toast("Please select an image", { type: "error" });
      setIsLoading(false);
      return null;
    }

    const newFormData = new FormData();
    newFormData.append("document", file);
    newFormData.append("name", file.name);
    newFormData.append("type", "image");

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_SERVER_URL_ASSETS}assets`,
        newFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return res;
    } catch (err) {
      toast(
        err?.response?.data?.errors?.[0]?.message ??
        err?.response?.data?.message ??
        "Failed to upload image",
        {
          type: "error",
          theme: "light",
          position: "top-right",
        }
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const result = await handleAddAssets(file);

      if (result?.data) {
        setUserUploads((prev) => [result.data, ...prev]);
      }
    } catch (e) {
      console.error("Error while uploading the file", e);
    } finally {
      setIsUploading(false);
      e.target.value = ""; // reset file input
    }
  };

  const handleAddImage = (imageUrl) => {
    if (!canvas) return;
    addImageToCanvas(canvas, imageUrl);
  };

  return (
    <div className="overflow-auto">
      <div className="p-4">
        <div className="upload-btn d-flex gap-2 rounded">
          <Label
            className={`w-100 d-flex align-items-center justify-content-center gap-2 py-2 px-4 text-white
          rounded fs-6 ${isUploading ? "opacity-70 cursor-not-allowed" : ""}
          `}
          >
            <Upload />
            <span>{isUploading ? "Uploading..." : t("Upload Files")}</span>
            <Input
              type="file"
              className="d-none"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </Label>
        </div>
        <div className="mt-3">
          <h4 className="fs-6 fw-bold mb-3">
            <small>{t("Your Uploads")}</small>
          </h4>
          {isLoading ? (
            <div className="border p-6 d-flex rounded align-items-center justify-content-center gap-3">
              <Loader2 />
              <p className="fw-bold">
                <small>{t("Loading your uploads...")}</small>
              </p>
            </div>
          ) : userUploads.length > 0 ? (
            <div className="d-flex flex-wrap gap-2 w-100">
              {userUploads.map((imageData) => (
                <div
                  className="upload-image rounded overflow-hidden"
                  key={imageData._id}
                  onClick={() => handleAddImage(imageData.url)}
                >
                  <img
                    src={imageData.url}
                    alt={imageData.name}
                    className="w-100 h-100 object-fit-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>{t("No Uploads yet")}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;
