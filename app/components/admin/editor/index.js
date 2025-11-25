"use client";

import { useParams, useRouter } from "next/navigation";
import Canvas from "@/app/components/admin/editor/canvas/index";
import Header from "@/app/components/admin/editor/header/index";
import Sidebar from "@/app/components/admin/editor/sidebar/index";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useEditorStore } from "@/app/redux/UserStore";
import Properties from "@/app/components/admin/editor/properties/index";

function MainEditor(props) {
  const params = useParams();
  const router = useRouter();
  const designId = params?.ID;
  console.log("props", props);
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

    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL_V1}template/${designId}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

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
        <div className="d-flex flex-column h-100 overflow-hidden">
          <Header />
          <div className="canva_body">
            {isEditing && <Sidebar />}
            <Canvas />
            {showProperties && isEditing && <Properties />}
          </div>
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
