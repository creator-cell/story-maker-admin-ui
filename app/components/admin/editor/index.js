"use client";

import { useParams, useRouter } from "next/navigation";
import Canvas from "./canvas";
import Header from "./header";
import Sidebar from "./sidebar";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useEditorStore } from "../../../redux/UserStore";
//import { getUserDesignByID } from "@/services/design-service";
import Properties from "./properties";
//import SubscriptionModal from "../subscription/premium-modal";

function MainEditor() {
  const params = useParams();
  const router = useRouter();
  const designId = params?.ID;
  console.log("designId", designId);
  const [isLoading, setIsLoading] = useState(!!designId);
  const [loadAttempted, setLoadAttempted] = useState(false);
  const [error, setError] = useState(null);

  const {
    canvas,
    setDesignId,
    resetStore,
    setName,
    setShowProperties,
    showProperties,
    isEditing,
    setShowPremiumModal,
    showPremiumModal,
  } = useEditorStore();

  useEffect(() => {
    //reset the store
    resetStore();

    //set the design id

    if (designId) setDesignId(designId);

    return () => {
      resetStore();
    };
  }, []);

  useEffect(() => {
    setLoadAttempted(false);
    setError(null);
  }, [designId]);

  useEffect(() => {
    if (isLoading && !canvas && designId) {
      const timer = setTimeout(() => {
        if (isLoading) {
          console.log("Canvas init timeout");
          setIsLoading(false);
        }
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isLoading, canvas, designId]);

  useEffect(() => {
    if (canvas) {
      console.log("Canvas is now available in editor");
    }
  }, [canvas]);

  const fetchTemplate = async (designId) => {
    // setLoader(true);
    console.log(
      `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${designId}`
    );
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_TEMPLATE}template/${designId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      console.log("res template", res);
      return res;
    } catch (err) {
      //toast.error("Failed to load template");
    } finally {
      setIsLoading(false);
    }
  };

  const loadDesign = useCallback(async () => {
    if (!canvas || !designId || loadAttempted) return;
    try {
      setIsLoading(true);
      setLoadAttempted(true);

      const response = await fetchTemplate(designId);
      const design = response.data.template;
      console.log("design loaded", design);

      if (design) {
        setName(design.name);
        setDesignId(designId);

        if (design.content) {
          canvas.clear();

          const canvasData =
            typeof design.content === "string"
              ? JSON.parse(design.content)
              : design.content;

          if (canvasData.background) {
            canvas.backgroundColor = canvasData.background;
          } else {
            canvas.backgroundColor = "#ffffff";
          }

          if (!canvasData.objects?.length) {
            canvas.renderAll();
            return;
          }

          canvas.loadFromJSON(canvasData).then(() => {
            canvas.requestRenderAll();
          });
        } else {
          canvas.clear();
          canvas.backgroundColor = "#ffffff";
          canvas.renderAll();
        }
      }
    } catch (e) {
      console.error("Failed to load design", e);
      setError("failed to load design");
    } finally {
      setIsLoading(false);
    }
  }, [canvas, designId, loadAttempted, setDesignId]);

  useEffect(() => {
    if (designId && canvas && !loadAttempted) {
      loadDesign();
    } else if (!designId) {
      router.replace("/");
    }
  }, [canvas, designId, loadDesign, loadAttempted, router]);

  useEffect(() => {
    if (!canvas) return;

    const handleSelectionCreated = () => {
      const activeObject = canvas.getActiveObject();

      console.log(activeObject, "activeObject");

      if (activeObject) {
        setShowProperties(true);
      }
    };

    const handleSelectionCleared = () => {
      setShowProperties(false);
    };

    canvas.on("selection:created", handleSelectionCreated);
    canvas.on("selection:updated", handleSelectionCreated);
    canvas.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvas.off("selection:created", handleSelectionCreated);
      canvas.off("selection:updated", handleSelectionCreated);
      canvas.off("selection:cleared", handleSelectionCleared);
    };
  }, [canvas]);

  return (
    <div id="main_container" className="p-2">
      <div className="inner_container">
        <div className="flex flex-col h-screen overflow-hidden">
          <Header />
          <div className="flex flex-1 overflow-hidden">
            {isEditing && <Sidebar />}

            <div className="flex-1 flex flex-col overflow-hidden relative">
              <main className="flex-1 overflow-hidden bg-[#f0f0f0] flex items-center justify-center">
                <Canvas />
              </main>
            </div>
          </div>
          {showProperties && isEditing && <Properties />}
          {/* <SubscriptionModal
        isOpen={showPremiumModal}
        onClose={setShowPremiumModal}
      /> */}
        </div>
      </div>
    </div>
  );
}

export default MainEditor;
