import React, { useEffect, useRef, useState } from "react";

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
    <>
      <div className="toolbar d-flex gap-4 align-items-center">
        <div className="dropdown">
          <button
            title="Tools"
            className="button dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {/* Tools */}
            <i className="fa-solid fa-wrench"></i>
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
                <i className="fa-regular fa-square"></i>
                <span className="ms-1">Rectangle</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("circle")}
              >
                <i
                  className="fa-regular fa-circle"
                ></i>
                <span className="ms-1">Circle</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("triangle")}
              >
                <i className="fa-solid fa-play"></i>
                <span className="ms-1">Triangle</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("ellipse")}
              >
                <i className="fa-regular fa-circle ellipse-icon"></i>
                <span className="ms-1">Ellipse</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("polygon")}
              >
                <i className="fa-solid fa-draw-polygon"></i>
                <span className="ms-1">Polygon</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("arrow")}
              >
                <i className="fa-solid fa-arrow-right"></i>
                <span className="ms-1">Arrow</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("doubleArrow")}
              >
                <i className="fa-solid fa-arrows-left-right"></i>
                <span className="ms-1">DoubleArrow</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("elbow")}
              >
                <i className="fa-solid fa-arrow-turn-down"></i>
                <span className="ms-1">Elbow</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("heart")}
              >
                <i className="fa-solid fa-heart"></i>
                <span className="ms-1">Heart</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("Cross")}
              >
                <i className="fa-solid fa-xmark"></i>
                <span className="ms-1">Cross</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                className="dropdown-item"
                onClick={() => onAddShape("star")}
              >
                <i className="fa-solid fa-star"></i>
                <span className="ms-1">Star</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("hexagon")}
              >
                <i className="fa-solid fa-hexagon"></i>
                <span className="ms-1">Hexagon</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddShape("pentagon")}
              >
                <i className="fa-solid fa-pentagon"></i>
                <span className="ms-1">Pentagon</span>
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
                <i className="fa-solid fa-minus"></i>
                <span className="ms-1">Straight Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("diagonal")}
              >
                <i className="fa-solid fa-minus Diagonal"></i>
                <span className="ms-1">Diagonal Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("curved")}
              >
                <i className="fa-solid fa-infinity"></i>
                <span className="ms-1">Curved Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("zigzag")}
              >
                <i className="fa-solid fa-bolt"></i>

                <span className="ms-1">Zigzag Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("dashed")}
              >
                {" "}
                <i className="fa-solid dashed-line"></i>
                <span className="ms-3">Dashed Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("dotted")}
              >
                <i className="fa-solid fa-ellipsis-h"></i>

                <span className="ms-1">Dotted Line</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                onClick={() => onAddLine("arrow")}
              >
                <i className="fa-solid fa-arrow-right"></i>
                <span className="ms-1">Arrow Line</span>
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
                <span className="gold"><i className="fa-regular fa-note-sticky"></i></span>
                <span className="ms-1">Yellow Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote2")}
              >
                <span className="orange"><i className="fa-regular fa-note-sticky"></i></span>
                <span className="ms-1">Orange Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote3")}
              >
               <span className="green"> <i className="fa-regular fa-note-sticky" ></i></span>
                <span className="ms-1">Green Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote4")}
              >
               <span className="blue"> <i className="fa-regular fa-note-sticky" ></i></span>
                <span className="ms-1">Blue Note</span>
              </button>
            </li>
            <li>
              <button
                className="dropdown-item"
                type="button"
                onClick={() => onAddStickyNote("stickyNote5")}
              >
               <span className="pink"> <i className="fa-regular fa-note-sticky"></i></span>
                <span className="ms-1">Pink Note</span>
              </button>
            </li>
          </ul>
        </div>

        <button
          title="Add Text"
          className="button"
          type="button"
          onClick={onAddText}
        >
          {/* Add Text */}
          <i className="fa-solid fa-font"></i>
        </button>
        <button
          title="Add Table"
          className="button"
          type="button"
          onClick={onAddTable}
        >
          {/* Add Table */}
          <i className="fa-solid fa-table"></i>
        </button>

        <label
          title="upload image"
          htmlFor="upload-image"
          className="button mb-0"
          style={{ cursor: "pointer" }}
        >
          {/* Upload Image */}
          <i className="fa-solid fa-image"></i>
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
    </>
  );
}
