import React, { useEffect, useRef, useState } from "react";

import FabricTextEditorToolbar from "./canvas/FabricTextEditorToolbar";

export default function FabricToolbar({
  onAddShape,
  onAddText,
  onAddLine,
  onAddTable,
  onDraw,
  onUpload,
  onSelectMenuChange,
  selectOptions = [],
  selectValue = "",
  onAddStickyNote,
  onTextFormat,
}) {
  const currentLabel =
    selectValue && selectOptions.find((opt) => opt.value === selectValue)
      ? selectOptions.find((opt) => opt.value === selectValue)?.label
      : "Select Option";
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  useEffect(() => {
    const c = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: "#fff",
    });
    setCanvas(c);

    const textbox = new fabric.Textbox("Edit me!", {
      left: 100,
      top: 100,
      fontSize: 20,
      fill: "#000",
    });
    c.add(textbox);
  }, []);
  return (
    <div>
      <div className="d-flex gap-2 align-items-center mb-3">
        <div className="dropdown">
          <button
            className="button dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Tools
          </button>
          <ul className="dropdown-menu">
            <li>
              <span className="dropdown-item-text fw-bold">Shapes</span>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("rect")}
              >
                Rectangle
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("circle")}
              >
                Circle
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("triangle")}
              >
                Triangle
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("ellipse")}
              >
                Ellipse
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("polygon")}
              >
                Polygon
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("arrow")}
              >
                Arrow
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("doubleArrow")}
              >
                DoubleArrow
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("elbow")}
              >
                Elbow
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("heart")}
              >
                Heart
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("Cross")}
              >
                Cross
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("star")}
              >
                Star
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("hexagon")}
              >
                Hexagon
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("pentagon")}
              >
                Pentagon
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            {/* Lines */}
            <li>
              <span className="dropdown-item-text fw-bold">Lines</span>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("straight")}
              >
                Straight Line
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("diagonal")}
              >
                Diagonal Line
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("curved")}
              >
                Curved Line
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("zigzag")}
              >
                Zigzag Line
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("dashed")}
              >
                Dashed Line
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("dotted")}
              >
                Dotted Line
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("arrow")}
              >
                Arrow Line
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            {/* Sticky Notes */}
            <li>
              <span className="dropdown-item-text fw-bold">Sticky Notes</span>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote1")}
              >
                Yellow Note
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote2")}
              >
                Orange Note
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote3")}
              >
                Green Note
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote4")}
              >
                Blue Note
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote5")}
              >
                Pink Note
              </button>
            </li>
          </ul>
        </div>

        <button className="button" type="button" onClick={onAddText}>
          Add Text
        </button>
        <button className="button" type="button" onClick={onAddTable}>
          Add Table
        </button>

        <label
          htmlFor="upload-image"
          className="button mb-0"
          style={{ cursor: "pointer" }}
        >
          Upload Image
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            id="upload-image"
            onChange={(e) => {
              if (e.target.files[0]) onUpload(e.target.files[0]);
              e.target.value = "";
            }}
          />
        </label>

        {/* Draw */}
        {/* <div className="dropdown">
          <button
            className="button dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Draw
          </button>
          <ul className="dropdown-menu">
            <li>
              <button
                className="dropdown-item"
                onClick={() => onDraw("pencil", "#000000")}
              >
                Pencil
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onDraw("brush", "#000000")}
              >
                Brush
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onDraw("highlighter", "yellow")}
              >
                Highlighter
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => onDraw("erase")}>
                Erase
              </button>
            </li>
            <li>
              <hr className="dropdown-divider" />
            </li>
            <li>
              <input
                type="color"
                onChange={(e) => onDraw("pencil", e.target.value)}
                style={{ width: "100%" }}
              />
            </li>
          </ul>
        </div> */}
      </div>
    </div>
  );
}
