import React from "react";
import { fabric } from "fabric";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaAlignJustify,
} from "react-icons/fa";

export default function FabricTextEditorToolbar({ fRef }) {
  console.log("fref", fRef);
  const getActiveText = () => {
    const canvas = fRef.current;
    console.log("canvas", fRef.current);
    if (!canvas) return null;
    const obj = canvas.getActiveObject();
    console.log(obj);
    return obj && obj.type === "textbox" ? obj : null;
  };

  const toggleStyle = (style) => {
    const text = getActiveText();
    console.log("text", text);
    if (!text) return;
    if (style === "bold") {
      text.set("fontWeight", text.fontWeight === "bold" ? "normal" : "bold");
    }
    if (style === "italic") {
      text.set("fontStyle", text.fontStyle === "italic" ? "normal" : "italic");
    }
    if (style === "underline") {
      text.set("underline", !text.underline);
    }
    fRef.current.renderAll();
  };

  const changeAlign = (align) => {
    const text = getActiveText();
    if (!text) return;
    text.set("textAlign", align);
    fRef.current.renderAll();
  };

  const changeColor = (color) => {
    const text = getActiveText();
    if (!text) return;
    text.set("fill", color);
    fRef.current.renderAll();
  };

  const changeBgColor = (color) => {
    const text = getActiveText();
    if (!text) return;
    text.set("backgroundColor", color);
    fRef.current.renderAll();
  };

  const changeFontSize = (size) => {
    const text = getActiveText();
    if (!text) return;
    text.set("fontSize", parseInt(size) || 16);
    fRef.current.renderAll();
  };

  const addText = () => {
    const canvas = fRef.current;
    console.log("canvas", fRef.current);
    if (!canvas) return;

    const textbox = new fabric.Textbox("Edit me", {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: "#000",
    });

    textbox.on("editing:exited", () => {
      if (!textbox.text || textbox.text.trim() === "") {
        textbox.text = "Edit me";
        console.log("edit me");

        canvas.renderAll();
      }
    });

    canvas.add(textbox).setActiveObject(textbox);
    canvas.renderAll();
  };

  return (
    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
      <button onClick={addText}>Add Text</button>

      <button onClick={() => toggleStyle("bold")}>
        <FaBold />
      </button>
      <button onClick={() => toggleStyle("italic")}>
        <FaItalic />
      </button>
      <button onClick={() => toggleStyle("underline")}>
        <FaUnderline />
      </button>

      <input type="color" onChange={(e) => changeColor(e.target.value)} />
      <input
        type="color"
        onChange={(e) => changeBgColor(e.target.value)}
        title="Background Color"
      />

      <select onChange={(e) => changeFontSize(e.target.value)}>
        {[12, 14, 16, 20, 24, 28, 32, 40, 48].map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>

      <button onClick={() => changeAlign("left")}>
        <FaAlignLeft />
      </button>
      <button onClick={() => changeAlign("center")}>
        <FaAlignCenter />
      </button>
      <button onClick={() => changeAlign("right")}>
        <FaAlignRight />
      </button>
      <button onClick={() => changeAlign("justify")}>
        <FaAlignJustify />
      </button>
    </div>
  );
}
