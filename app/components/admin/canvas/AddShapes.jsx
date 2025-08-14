import { fabric } from "fabric";

export const addShape = (fRef, type) => {
  const f = fRef.current;
  if (!f) return;
  console.log("type", type);
  let shape;
  switch (type) {
    case "rect":
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        width: 150,
        height: 100,
        fill: "#fde68a",
      });
      break;
    case "circle":
      shape = new fabric.Circle({
        left: 150,
        top: 150,
        radius: 60,
        fill: "#bfdbfe",
      });
      break;
    // ... (polygon, star, hexagon, pentagon cases here)
    case "triangle":
      shape = new fabric.Triangle({
        left: 200,
        top: 120,
        width: 120,
        height: 100,
        fill: "#bbf7d0",
      });
      break;
    case "ellipse":
      shape = new fabric.Ellipse({
        left: 150,
        top: 100,
        rx: 80,
        ry: 40,
        fill: "skyblue",
        stroke: "black",
        strokeWidth: 2,
      });
      break;
    case "polygon": {
      const points = [
        { x: 50, y: 0 },
        { x: 100, y: 38 },
        { x: 81, y: 90 },
        { x: 19, y: 90 },
        { x: 0, y: 38 },
      ];
      shape = new fabric.Polygon(points, {
        left: 150,
        top: 150,
        fill: "purple",
        stroke: "black",
        strokeWidth: 2,
      });
      break;
    }
    case "star": {
      const points = [
        { x: 50, y: 0 },
        { x: 61, y: 35 },
        { x: 98, y: 35 },
        { x: 68, y: 57 },
        { x: 79, y: 91 },
        { x: 50, y: 70 },
        { x: 21, y: 91 },
        { x: 32, y: 57 },
        { x: 2, y: 35 },
        { x: 39, y: 35 },
      ];
      shape = new fabric.Polygon(points, {
        left: 150,
        top: 150,
        fill: "gold",
        stroke: "black",
        strokeWidth: 2,
      });
      break;
    }
    case "hexagon": {
      const points = [];
      const numSides = 6;
      const radius = 50;
      for (let i = 0; i < numSides; i++) {
        const angle = (i * 2 * Math.PI) / numSides;
        points.push({
          x: radius + radius * Math.cos(angle),
          y: radius + radius * Math.sin(angle),
        });
      }
      shape = new fabric.Polygon(points, {
        left: 150,
        top: 150,
        fill: "orange",
        stroke: "black",
        strokeWidth: 2,
      });
      break;
    }
    case "pentagon": {
      const points = [];
      const numSides = 5;
      const radius = 50;
      for (let i = 0; i < numSides; i++) {
        const angle = (i * 2 * Math.PI) / numSides - Math.PI / 2;
        points.push({
          x: radius + radius * Math.cos(angle),
          y: radius + radius * Math.sin(angle),
        });
      }
      shape = new fabric.Polygon(points, {
        left: 150,
        top: 150,
        fill: "lime",
        stroke: "black",
        strokeWidth: 2,
      });
      break;
    }
    case "line": {
      shape = new fabric.Line([50, 150, 200, 150], {
        stroke: "#111",
        strokeWidth: 2,
      });
      break;
    }
    case "dashedLine": {
      shape = new fabric.Line([50, 150, 200, 150], {
        stroke: "#111",
        strokeWidth: 2,
        strokeDashArray: [10, 5],
      });
      break;
    }
    case "arrowLine": {
      const line = new fabric.Line([50, 150, 200, 150], {
        stroke: "#111",
        strokeWidth: 2,
      });
      const arrow = new fabric.Triangle({
        left: 200,
        top: 140,
        width: 15,
        height: 15,
        fill: "#111",
        angle: 90,
      });
      shape = new fabric.Group([line, arrow], {
        left: 150,
        top: 150,
      });
      break;
    }

    default:
      return;
  }
  f.add(shape).setActiveObject(shape);
};
