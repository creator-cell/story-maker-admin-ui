import React, { useState } from "react";
import { fabric } from "fabric";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
  FaTrash,
  FaCopy,
  FaPencilAlt,
  FaHighlighter,
  FaTimes,
} from "react-icons/fa";

export default function FabricTextEditorToolbar({ fRef }) {
  const [fill, setFill] = useState("#000000");
  const [stroke, setStroke] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const [brushColor, setBrushColor] = useState("#000000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [activeTool, setActiveTool] = useState(null);

  const [fontFamily, setFontFamily] = useState("Arial");

  const getActiveObj = () => {
    const canvas = fRef.current;
    if (!canvas) return null;
    return canvas.getActiveObject() || null;
  };

  const disableDrawing = () => {
    const canvas = fRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = false;
    setActiveTool(null);
  };

  const getActiveText = () => {
    const obj = getActiveObj();
    if (!obj) return null;
    if (["i-text", "textbox", "text"].includes(obj.type)) {
      return obj;
    }
    return null;
  };

  const toggleStyle = (style) => {
    const text = getActiveText();
    if (!text) return;

    const selectionStart = text.selectionStart;
    const selectionEnd = text.selectionEnd;

    if (selectionStart !== selectionEnd) {
      // Apply to selected range only
      let styleProp = {};
      if (style === "bold") {
        styleProp = {
          fontWeight:
            text.getSelectionStyles()[0]?.fontWeight === "bold"
              ? "normal"
              : "bold",
        };
      }
      if (style === "italic") {
        styleProp = {
          fontStyle:
            text.getSelectionStyles()[0]?.fontStyle === "italic"
              ? "normal"
              : "italic",
        };
      }
      if (style === "underline") {
        styleProp = { underline: !text.getSelectionStyles()[0]?.underline };
      }
      text.setSelectionStyles(styleProp, selectionStart, selectionEnd);
    } else {
      // Apply to whole object if no selection
      if (style === "bold") {
        text.set("fontWeight", text.fontWeight === "bold" ? "normal" : "bold");
      }
      if (style === "italic") {
        text.set(
          "fontStyle",
          text.fontStyle === "italic" ? "normal" : "italic"
        );
      }
      if (style === "underline") {
        text.set("underline", !text.underline);
      }
    }

    fRef.current.requestRenderAll();
  };

  const changeAlign = (align) => {
    const text = getActiveText();
    if (!text) return;
    text.set("textAlign", align);
    fRef.current.renderAll();
  };

  const applyProps = (props) => {
    const canvas = fRef.current;
    if (!canvas) return;
    const obj = getActiveObj();
    if (!obj) return;
    obj.set(props);
    canvas.requestRenderAll();
  };

  const changeFontSize = (size) => {
    const text = getActiveText();
    if (!text) return;
    text.set("fontSize", parseInt(size) || 16);
    fRef.current.renderAll();
  };

  const changeFontFamily = (family) => {
    setFontFamily(family);
    const text = getActiveText();
    if (!text) return;
    text.set("fontFamily", family);
    fRef.current.renderAll();
  };

  const applyTextStyle = (style) => {
    const text = getActiveText();
    if (!text) return;

    const styles = {
      h1: { fontSize: 48, fontWeight: "bold" },
      h2: { fontSize: 36, fontWeight: "bold" },
      h3: { fontSize: 28, fontWeight: "bold" },
      h4: { fontSize: 24, fontWeight: "normal" },
      h5: { fontSize: 20, fontWeight: "normal" },
      h6: { fontSize: 16, fontWeight: "normal" },
      p: { fontSize: 16, fontWeight: "normal" },
    };

    text.set(styles[style]);
    fRef.current.renderAll();
  };

  const addText = () => {
    const canvas = fRef.current;
    if (!canvas) return;
    console.log("Adding text...");
    disableDrawing();

    const defaultProps = {
      left: 100,
      top: 100,
      fontSize: 24,
      fontFamily: fontFamily,
      fill: "#000000",
      padding: 0,
      textAlign: "left",
      id: `text-${Date.now()}`,
    };

    const textObj = new fabric.IText("Edit me", { ...defaultProps });

    textObj.on("editing:exited", () => {
      if (!textObj.text || textObj.text.trim() === "") {
        textObj.set("text", "Edit me");
      }
      canvas.renderAll();
    });

    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
  };

  // ---------- Drawing Tools ----------
  const activatePencil = () => {
    const canvas = fRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = true;
    const brush = new fabric.PencilBrush(canvas);
    brush.color = brushColor;
    brush.width = brushWidth;
    canvas.freeDrawingBrush = brush;
    setActiveTool("pencil");
    canvas.requestRenderAll();
  };

  const activateHighlighter = () => {
    const canvas = fRef.current;
    if (!canvas) return;
    canvas.isDrawingMode = true;
    const brush = new fabric.PencilBrush(canvas);
    brush.color = brushColor + "80"; // add transparency
    brush.width = brushWidth * 3;
    brush.globalCompositeOperation = "multiply";
    canvas.freeDrawingBrush = brush;
    setActiveTool("highlighter");
    canvas.requestRenderAll();
  };

  const exitDrawingMode = () => {
    disableDrawing();
    const canvas = fRef.current;
    if (!canvas) return;
    canvas.freeDrawingBrush = null;
    canvas.renderAll();
  };

  // ---------- Delete & Duplicate ----------
  const deleteObj = () => {
    const canvas = fRef.current;
    if (!canvas) return;
    const active = getActiveObj();
    if (active) {
      canvas.remove(active);
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  };

  const duplicateObj = () => {
    const canvas = fRef.current;
    if (!canvas) return;
    const active = getActiveObj();
    if (!active) return;
    active.clone((cloned) => {
      cloned.set({
        left: active.left + 20,
        top: active.top + 20,
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  };

  return (
    <>
      <div
        className="editor-toolbar"
        style={{
          display: "flex",
          gap: "29px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <button type="button" title="Add Text" onClick={addText}>
          Add Text
        </button>

        {/* Text Style (Headings/Paragraphs) */}
        <select
          title="Text Style"
          onChange={(e) => applyTextStyle(e.target.value)}
        >
          <option value="">Text Style</option>
          <option value="p">Paragraph</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        {/* font size */}
        <select title="Size" onChange={(e) => changeFontSize(e.target.value)}>
          {[12, 14, 16, 20, 24, 28, 32, 40, 48].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>

        {/* Font Family */}
        <select
          title="Fonts"
          value={fontFamily}
          onChange={(e) => changeFontFamily(e.target.value)}
        >
          {[
            "Arial",
            "Times New Roman",
            "Georgia",
            "Courier New",
            "Verdana",
          ].map((family) => (
            <option key={family} value={family}>
              {family}
            </option>
          ))}
        </select>

        {/* text styles */}
        <button type="button" title="Bold" onClick={() => toggleStyle("bold")}>
          <FaBold />
        </button>
        <button
          type="button"
          title="Italic"
          onClick={() => toggleStyle("italic")}
        >
          <FaItalic />
        </button>
        <button
          type="button"
          title="Underline"
          onClick={() => toggleStyle("underline")}
        >
          <FaUnderline />
        </button>

        {/* alignments */}
        <button
          type="button"
          title="Align Left"
          onClick={() => changeAlign("left")}
        >
          <FaAlignLeft />
        </button>
        <button
          type="button"
          title="Align Center"
          onClick={() => changeAlign("center")}
        >
          <FaAlignCenter />
        </button>
        <button
          type="button"
          title="Align Right"
          onClick={() => changeAlign("right")}
        >
          <FaAlignRight />
        </button>
        <button
          title="Justify"
          type="button"
          onClick={() => changeAlign("justify")}
        >
          <FaAlignJustify />
        </button>

        {/* delete & duplicate */}
        <button title="Delete" type="button" onClick={deleteObj}>
          <FaTrash />
        </button>
        <button title="Copy" type="button" onClick={duplicateObj}>
          <FaCopy />
        </button>

        <button title="Exit Draw" type="button" onClick={exitDrawingMode}>
          <FaTimes /> Exit Draw
        </button>

        <label title="Stroke Width">
          Stroke Width:
          <input
            type="number"
            min="1"
            value={strokeWidth}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10) || 1;
              setStrokeWidth(val);
              disableDrawing();
              applyProps({ strokeWidth: val });
            }}
          />
        </label>

        {/* brush settings */}
        <label title="Brush Color">
          Brush Color:
          <input
            type="color"
            value={brushColor}
            onChange={(e) => {
              setBrushColor(e.target.value);
              const canvas = fRef.current;
              if (canvas && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.color = e.target.value;
                canvas.renderAll();
              }
            }}
          />
        </label>
        {/* Fill & Stroke */}
        <label title="Fill Color">
          Fill:
          <input
            type="color"
            value={fill}
            onChange={(e) => {
              setFill(e.target.value);
              disableDrawing();
              applyProps({ fill: e.target.value });
            }}
          />
        </label>

        <label title="Stroke Color">
          Stroke:
          <input
            type="color"
            value={stroke}
            onChange={(e) => {
              setStroke(e.target.value);
              disableDrawing();
              applyProps({ stroke: e.target.value });
            }}
          />
        </label>

        {/* Draw Dropdown */}
      </div>
      <div className="dropdown mt-4 w-25">
        <button
          title="Draw"
          className="button dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {/* <i className="fa-solid fa-pencil"></i>  */}
          Draw
        </button>
        <ul className="dropdown-menu p-2" style={{ minWidth: "200px" }}>
          <li>
            <button
              type="button"
              className="dropdown-item"
              onClick={activatePencil}
            >
              <FaPencilAlt /> Pencil
            </button>
          </li>
          <li>
            <button
              type="button"
              className="dropdown-item"
              onClick={activateHighlighter}
            >
              <FaHighlighter /> Highlighter
            </button>
          </li>
          <li>
            <hr className="dropdown-divider" />
          </li>
          <li className="px-2">
            <label className="form-label">Brush Size</label>
            <input
              type="number"
              min="1"
              max="50"
              value={brushWidth}
              className="form-control"
              onChange={(e) => {
                const val = parseInt(e.target.value, 10) || 1;
                setBrushWidth(val);
                const canvas = fRef.current;
                if (canvas && canvas.freeDrawingBrush) {
                  canvas.freeDrawingBrush.width = val;
                  canvas.renderAll();
                }
              }}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
