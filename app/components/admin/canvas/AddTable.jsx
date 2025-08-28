export const addTable = (fRef) => {
  const f = fRef.current;
  if (!f) return;
  const rows = 3;
  const columns = 3;
  const cellWidth = 60;
  const cellHeight = 40;
  const cells = [];
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      const rect = new fabric.Rect({
        left: j * cellWidth,
        top: i * cellHeight,
        fill: "white",
        stroke: "black",
        width: cellWidth,
        height: cellHeight,
      });
      cells.push(rect);
    }
  }
  const tableGroup = new fabric.Group(cells, {
    left: 100,
    top: 100,
  });
  f.add(tableGroup).setActiveObject(tableGroup);
  f.renderAll();
};
