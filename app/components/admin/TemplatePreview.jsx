import { useEffect, useRef } from "react";

const fabric = await import("fabric");
const TemplatePreview = ({ content, width = 200, height = 150 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!content) return;

    const canvas = new fabric.StaticCanvas(canvasRef.current, {
      width,
      height,
      backgroundColor: "#fff",
    });

    try {
      canvas.loadFromJSON(content, () => {
        canvas.renderAll();
      });
    } catch (err) {
      console.error("Error rendering template content:", err);
    }

    return () => {
      canvas.dispose();
    };
  }, [content, width, height]);

  return <canvas ref={canvasRef} style={{ border: "1px solid #ddd" }} />;
};

export default TemplatePreview;
