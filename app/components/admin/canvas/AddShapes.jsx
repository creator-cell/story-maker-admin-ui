// addShape.js
import { fabric } from "fabric";

const PADDING = 12;

export const addShape = (fRef, shapeKey) => {
  const canvas = fRef?.current;
  if (!canvas) return;

  const shape = createShape(shapeKey);

  shape.set({
    left: 150,
    top: 120,
    selectable: true,
    objectCaching: false,
  });

  canvas.add(shape);

  // Only add textbox for non-connector shapes
  if (shouldHaveTextbox(shapeKey)) {
    const textbox = createTextboxForShape(shape);
    canvas.add(textbox);
    linkShapeAndTextbox(canvas, shape, textbox);
    canvas.setActiveObject(textbox);
  } else {
    canvas.setActiveObject(shape);
  }

  canvas.requestRenderAll();
};

/* ----------------- shape creation ----------------- */
function createShape(key) {
  switch (key) {
    case "rect":
      return new fabric.Rect({
        width: 100,
        height: 60,
        fill: "#fde68a",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "circle":
      return new fabric.Circle({
        radius: 50,
        fill: "#a5f3fc",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "triangle":
      return new fabric.Triangle({
        width: 80,
        height: 80,
        fill: "#fca5a5",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "ellipse":
      return new fabric.Ellipse({
        rx: 60,
        ry: 30,
        fill: "#d9f99d",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "line":
      return new fabric.Line([50, 50, 200, 50], {
        stroke: "#000",
        strokeWidth: 4,
      });

    case "arrow":
      return new fabric.Polygon(
        [
          { x: 0, y: -10 },
          { x: 80, y: -10 },
          { x: 80, y: -30 },
          { x: 120, y: 0 },
          { x: 80, y: 30 },
          { x: 80, y: 10 },
          { x: 0, y: 10 },
        ],
        { fill: "#000" }
      );

    case "doubleArrow":
      return new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: 20, y: -20 },
          { x: 20, y: -10 },
          { x: 80, y: -10 },
          { x: 80, y: -20 },
          { x: 100, y: 0 },
          { x: 80, y: 20 },
          { x: 80, y: 10 },
          { x: 20, y: 10 },
          { x: 20, y: 20 },
        ],
        { fill: "#000" }
      );

    case "elbow":
      return new fabric.Polyline(
        [
          { x: 0, y: 0 },
          { x: 80, y: 0 },
          { x: 80, y: 60 },
        ],
        { stroke: "#000", strokeWidth: 4, fill: "" }
      );

    case "star":
      return new fabric.Polygon(generateStarPoints(5, 60, 30), {
        fill: "#fbbf24",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "pentagon":
      return new fabric.Polygon(generatePolygonPoints(5, 60), {
        fill: "#93c5fd",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "hexagon":
      return new fabric.Polygon(generatePolygonPoints(6, 60), {
        fill: "#86efac",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "octagon":
      return new fabric.Polygon(generatePolygonPoints(8, 60), {
        fill: "#f9a8d4",
        stroke: "#000",
        strokeWidth: 2,
      });

    case "heart":
      return new fabric.Path(
        "M 272,0 A 136,136 0 0,1 544,0 Q 544,136 272,272 Q 0,136 0,0 A 136,136 0 0,1 272,0 z",
        {
          scaleX: 0.2,
          scaleY: 0.2,
          fill: "#fb7185",
          stroke: "#000",
          strokeWidth: 2,
        }
      );

    case "cross":
      return new fabric.Polygon(
        [
          { x: -20, y: -60 },
          { x: 20, y: -60 },
          { x: 20, y: -20 },
          { x: 60, y: -20 },
          { x: 60, y: 20 },
          { x: 20, y: 20 },
          { x: 20, y: 60 },
          { x: -20, y: 60 },
          { x: -20, y: 20 },
          { x: -60, y: 20 },
          { x: -60, y: -20 },
          { x: -20, y: -20 },
        ],
        { fill: "#f87171", stroke: "#000", strokeWidth: 2 }
      );

    default:
      return new fabric.Rect({
        width: 100,
        height: 60,
        fill: "#e5e7eb",
      });
  }
}

/* ----------------- text handling ----------------- */
function shouldHaveTextbox(key) {
  return (
    key !== "line" &&
    key !== "arrow" &&
    key !== "doubleArrow" &&
    key !== "elbow" &&
    !key.toLowerCase().includes("connector")
  );
}

function createTextboxForShape(shape) {
  const b = shape.getBoundingRect(true, true);
  const tb = new fabric.Textbox("", {
    left: b.left + PADDING,
    top: b.top + PADDING,
    width: Math.max(40, b.width - PADDING * 2),
    fontSize: 18,
    fill: "#000",
    editable: true,
    textAlign: "center",
    objectCaching: false,
  });

  tb.on("changed", () => {
    if (!tb.text) tb.set("text", "");
  });

  return tb;
}

function linkShapeAndTextbox(canvas, shape, textbox) {
  const resync = () => {
    const b = shape.getBoundingRect(true, true);
    textbox.set({
      left: b.left + PADDING,
      top: b.top + PADDING,
      width: Math.max(40, b.width - PADDING * 2),
    });
    textbox.setCoords();
    canvas.requestRenderAll();
  };

  shape.on("moving", resync);
  shape.on("scaled", resync);
  shape.on("scaling", resync);
  shape.on("rotated", resync);
  shape.on("modified", resync);
}

/* ----------------- geometry helpers ----------------- */
function generateStarPoints(spikes, outer, inner) {
  const pts = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const angle = (i * Math.PI) / spikes - Math.PI / 2;
    pts.push({ x: r * Math.cos(angle), y: r * Math.sin(angle) });
  }
  return pts;
}

function generatePolygonPoints(sides, radius) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    pts.push({ x: radius * Math.cos(angle), y: radius * Math.sin(angle) });
  }
  return pts;
}
