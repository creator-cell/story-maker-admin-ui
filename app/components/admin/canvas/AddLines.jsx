import { fabric } from "fabric";

export const addLine = (fRef, type) => {
  const f = fRef.current;
  if (!f) return;
  let lineObj;

  switch (type) {
    case "straight":
      lineObj = new fabric.Line([50, 100, 250, 100], {
        stroke: "#111",
        strokeWidth: 2,
      });
      break;
    case "arrow": {
      const line = new fabric.Line([50, 400, 250, 400], {
        stroke: "#111",
        strokeWidth: 2,
      });
      const arrow = new fabric.Triangle({
        left: 250,
        top: 392,
        width: 12,
        height: 12,
        fill: "#111",
        angle: 90,
        originX: "center",
        originY: "center",
      });
      lineObj = new fabric.Group([line, arrow], { left: 150, top: 400 });
      break;
    }
    default:
      return;
  }

  f.add(lineObj).setActiveObject(lineObj);
};
