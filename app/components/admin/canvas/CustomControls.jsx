import { fabric } from "fabric";

export const setupCustomControls = () => {
  if (!fabric) return;

  if (!fabric.Object.prototype.controls.deleteControl) {
    fabric.Object.prototype.controls.deleteControl = new fabric.Control({
      x: 0.5,
      y: -0.5,
      offsetY: -10,
      offsetX: 10,
      cursorStyle: "pointer",
      mouseUpHandler: (eventData, transform) => {
        const target = transform.target;
        const canvas = target.canvas;
        canvas.remove(target);
        canvas.requestRenderAll();
      },
      render: function (ctx, left, top) {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("🗑️", 0, 0);
        ctx.restore();
      },
      cornerSize: 24,
    });
  }

  if (!fabric.Object.prototype.controls.lockControl) {
    fabric.Object.prototype.controls.lockControl = new fabric.Control({
      x: -0.5,
      y: -0.5,
      offsetY: -10,
      offsetX: -10,
      cursorStyle: "pointer",
      mouseUpHandler: (eventData, transform) => {
        const target = transform.target;
        const locked = target.lockMovementX;
        target.set({
          lockMovementX: !locked,
          lockMovementY: !locked,
          hasControls: true,
          hasBorders: true,
        });
        target.canvas.requestRenderAll();
      },
      render: function (ctx, left, top, styleOverride, fabricObject) {
        const size = this.cornerSize;
        ctx.save();
        ctx.translate(left, top);
        ctx.font = `${size}px sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const text = fabricObject.lockMovementX ? "🔒" : "🔓";
        ctx.fillText(text, 0, 0);
        ctx.restore();
      },
      cornerSize: 24,
    });
  }
};
