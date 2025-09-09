export const addStickyNote = (fRef, type) => {
  const f = fRef.current;
  if (!f) return;

  const colors = {
    stickyNote1: "#fff59d",
    stickyNote2: "#ffcc80",
    stickyNote3: "#c5e1a5",
    stickyNote4: "#81d4fa",
    stickyNote5: "#f48fb1",
  };

  const rect = new fabric.Rect({
    width: 200,
    height: 150,
    fill: colors[type] || "#fff59d",
    stroke: "#999",
    strokeWidth: 2,
    rx: 10,
    ry: 10,
    originX: "center",
    originY: "center",
  });

  const text = new fabric.Textbox("Write here...", {
    fontSize: 16,
    fontFamily: "Arial",
    fill: "#333",
    width: 180,
    textAlign: "left",
    originX: "center",
    originY: "center",
    editable: true,
  });

  const group = new fabric.Group([rect, text], {
    left: 150,
    top: 150,
    hasControls: true,
    hasBorders: true,
    lockScalingFlip: true,
    subTargetCheck: true,
  });

  // Double-click to edit text inside sticky note
  group.on("mousedblclick", (e) => {
    const target = e.subTargets?.[0];
    if (target && target.type === "textbox") {
      const objects = group._objects;
      group._restoreObjectsState();
      f.remove(group);
      objects.forEach((obj) => f.add(obj));
      f.setActiveObject(target);
      f.renderAll();

      target.enterEditing();
      target.hiddenTextarea && target.hiddenTextarea.focus();

      target.on("editing:exited", () => {
        const newGroup = new fabric.Group(objects, {
          left: group.left,
          top: group.top,
          hasControls: true,
          hasBorders: true,
          lockScalingFlip: true,
          subTargetCheck: true,
        });
        f.remove(...objects);
        f.add(newGroup);
        f.setActiveObject(newGroup);
        f.renderAll();
      });
    }
  });

  f.add(group).setActiveObject(group);
};
