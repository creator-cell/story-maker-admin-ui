import { fabric } from "fabric";

export function enableDraw(fRef, color = "#000000", width = 2) {
  const f = fRef.current;
  if (!f) return;

  f.isDrawingMode = true;
  f.freeDrawingBrush = new fabric.PencilBrush(f);
  f.freeDrawingBrush.color = color;
  f.freeDrawingBrush.width = width;
}

export function enableErase(fRef) {
  const f = fRef.current;
  if (!f) return;

  f.isDrawingMode = true;
  // fabric EraserBrush is available from v5.2+
  if (fabric.EraserBrush) {
    f.freeDrawingBrush = new fabric.EraserBrush(f);
    f.freeDrawingBrush.width = 20;
  } else {
    console.warn("EraserBrush is not available in this version of Fabric.js");
  }
}

// Set a custom drawing mode (like marker, highlighter, pencil)
export function setDrawingMode(
  fRef,
  tool = "pencil",
  color = "#000000",
  width = 2
) {
  const f = fRef.current;
  if (!f) return;

  f.isDrawingMode = true;

  switch (tool) {
    case "pencil":
      f.freeDrawingBrush = new fabric.PencilBrush(f);
      break;
    case "circle":
      f.freeDrawingBrush = new fabric.CircleBrush(f);
      break;
    case "spray":
      f.freeDrawingBrush = new fabric.SprayBrush(f);
      break;
    case "pattern":
      f.freeDrawingBrush = new fabric.PatternBrush(f);
      break;
    case "eraser":
      if (fabric.EraserBrush) {
        f.freeDrawingBrush = new fabric.EraserBrush(f);
      } else {
        console.warn("EraserBrush not available in this Fabric.js version");
      }
      break;
    default:
      f.freeDrawingBrush = new fabric.PencilBrush(f);
  }

  if (f.freeDrawingBrush) {
    f.freeDrawingBrush.color = color;
    f.freeDrawingBrush.width = width;
  }
}
