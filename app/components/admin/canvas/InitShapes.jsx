import { fabric } from "fabric";

export const initCanvas = (canvasRef, wrapRef, fRef, setSelectedObject) => {
  console.log("Initializing canvas...");
  if (!canvasRef.current) return;
  const f = new fabric.Canvas(canvasRef.current, {
    backgroundColor: "#f8fafc",
    selection: true,
  });
  fRef.current = f;

  // const starter = new fabric.IText("Double-click to edit", {
  //   left: 80,
  //   top: 80,
  //   fontSize: 28,
  // });
  //  f.add(starter).setActiveObject(starter);

  f.on("selection:created", (e) => {
    const obj = e.target || (e.selected && e.selected[0]);
    setSelectedObject(obj);
  });
  f.on("selection:updated", (e) => {
    const obj = e.target || (e.selected && e.selected[0]);
    setSelectedObject(obj);
  });
  f.on("selection:cleared", () => {
    setSelectedObject();
  });

  const resize = () => {
    if (!wrapRef.current) return;
    const w = wrapRef.current.clientWidth;
    const h = Math.max(420, Math.round((w * 9) / 16));
    f.setWidth(w);
    f.setHeight(h);
    f.renderAll();
  };
  resize();
  window.addEventListener("resize", resize);

  return () => {
    window.removeEventListener("resize", resize);
    f.dispose();
  };
};
