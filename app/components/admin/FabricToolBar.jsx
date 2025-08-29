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
      <div className="toolbar d-flex gap-4 align-items-center mt-3 mb-3">
        <div className="dropdown">
          <button
            className="button dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {/* Tools */}
            <i class="fa-solid fa-wrench"></i>
          </button>
          <ul className="dropdown-menu">
            <li>
              <span className="dropdown-item-text fw-bold">Shapes</span>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("rect")}
              >
                <i class="fa-regular fa-square"></i>
                <span>Rectangle</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("circle")}
              >
                <i
                  class="fa-
                regular fa-circle"
                ></i>
                <span>Circle</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("triangle")}
              >
                <i class="fa-solid fa-play"></i>
                <span>Triangle</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("ellipse")}
              >
                <i class="fa-regular fa-circle ellipse-icon"></i>
                <span> Ellipse</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("polygon")}
              >
                <i class="fa-solid fa-draw-polygon"></i>

                <span> Polygon</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("arrow")}
              >
                <i class="fa-solid fa-arrow-right"></i>
                <span>Arrow</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("doubleArrow")}
              >
                <i class="fa-solid fa-arrows-left-right"></i>
                <span> DoubleArrow</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("elbow")}
              >
                <i class="fa-solid fa-arrow-turn-down"></i>
                <span> Elbow</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("heart")}
              >
                <i class="fa-solid fa-heart"></i>

                <span> Heart </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("Cross")}
              >
                <i class="fa-solid fa-xmark"></i>

                <span> Cross</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("star")}
              >
                <i class="fa-solid fa-star"></i>
                <span>Star</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("hexagon")}
              >
                <i class="fa-solid fa-hexagon"></i>
                <span> Hexagon</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("pentagon")}
              >
                <i class="fa-solid fa-pentagon"></i>
                <span> Pentagon </span>
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
                <i class="fa-solid fa-minus"></i>
                <span>Straight Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("diagonal")}
              >
                <i
                  class="fa-solid fa-minus"
                  style={{
                    transform: "rotate(135deg)",
                    display: "inline-block",
                    marginRight: "8px",
                  }}
                ></i>

                <span>Diagonal Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("curved")}
              >
                <i class="fa-solid fa-infinity"></i>

                <span> Curved Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("zigzag")}
              >
                <i class="fa-solid fa-bolt"></i>

                <span> Zigzag Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("dashed")}
              >
                {" "}
                <span
                  style={{
                    display: "inline-block",
                    width: "20px",
                    borderTop: "2px dashed #000",
                    marginRight: "8px",
                  }}
                ></span>
                <span>Dashed Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("dotted")}
              >
                <i class="fa-solid fa-ellipsis-h"></i>

                <span> Dotted Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("arrow")}
              >
                <i class="fa-solid fa-arrow-right"></i>

                <span> Arrow Line</span>
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
                <i
                  class="fa-regular fa-note-sticky"
                  style={{ color: "gold" }}
                ></i>

                <span> Yellow Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote2")}
              >
                <i
                  class="fa-regular fa-note-sticky"
                  style={{ color: "orange" }}
                ></i>
                <span> Orange Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote3")}
              >
                <i
                  class="fa-regular fa-note-sticky"
                  style={{ color: "green" }}
                ></i>
                <span> Green Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote4")}
              >
                <i
                  class="fa-regular fa-note-sticky"
                  style={{ color: "blue" }}
                ></i>
                <span> Blue Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote5")}
              >
                <i
                  class="fa-regular fa-note-sticky"
                  style={{ color: "pink" }}
                ></i>
                <span> Pink Note</span>
              </button>
            </li>
          </ul>
        </div>

        <button className="button" type="button" onClick={onAddText}>
          {/* Add Text */}
          <i class="fa-solid fa-font"></i>
        </button>
        <button className="button" type="button" onClick={onAddTable}>
          {/* Add Table */}
          <i class="fa-solid fa-table"></i>
        </button>

        <label
          htmlFor="upload-image"
          className="button mb-0"
          style={{ cursor: "pointer" }}
        >
          {/* Upload Image */}
          <i class="fa-solid fa-image"></i>
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
