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

function UploadPanel() {
  const { canvas } = useEditorStore();
  console.log("canvas", canvas);
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
      console.log("items", items);
      console.log("currentUser._id:", currentUser._id);
      const myItems = items.filter(
        (asset) => String(asset.uploadedBy?._id) === String(currentUser._id)
      );

      setUserUploads(myItems);
      console.log("Fetched my assets:", myItems);
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
      console.log("result", result);

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
    console.log(imageUrl);
    console.log(canvas);
    // if (!canvas) return;
    addImageToCanvas(canvas, imageUrl);
  };

  console.log(userUploads, "userUploads");

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        <div className="flex gap-2">
          <Label
            className={`w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white
          rounded-md cursor-pointer h-12 font-medium transition-colors ${
            isUploading ? "opacity-70 cursor-not-allowed" : ""
          }
          `}
          >
            <Upload className="w-5 h-5" />
            <span>{isUploading ? "Uploading..." : "Upload Files"}</span>
            <Input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </Label>
        </div>
        <div className="mt-5">
          <h4 className="text-sm text-gray-500 mb-5">Your Uploads</h4>
          {isLoading ? (
            <div className="border p-6 flex rounded-md items-center justify-center">
              <Loader2 className="w-4 h-4" />
              <p className="font-bold text-sm">Loading your uploads...</p>
            </div>
          ) : userUploads.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {userUploads.map((imageData) => (
                <div
                  className="aspect-auto bg-gray-50 rounded-md overflow-hidden hover:opacity-85 transition-opacity relative group"
                  key={imageData._id}
                  onClick={() => handleAddImage(imageData.url)}
                >
                  <img
                    src={imageData.url}
                    alt={imageData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div>No Uploads yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPanel;
