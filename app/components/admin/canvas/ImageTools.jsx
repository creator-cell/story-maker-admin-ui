// /canvas/imageTools.js
import { fabric } from "fabric";

/**
 * Upload an image to the Fabric canvas.
 * @param {Object} fRef - React ref to the Fabric canvas instance.
 * @param {File} file - Image file from <input type="file" />.
 */
export function onUploadImage(fRef, file) {
  const f = fRef.current;
  if (!f || !file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fabric.Image.fromURL(e.target.result, (img) => {
      img.set({
        left: 100,
        top: 100,
        selectable: true,
      });
      f.add(img).setActiveObject(img);
      f.renderAll();
    });
  };
  reader.readAsDataURL(file);
}

/**
 * Delete the currently selected object (if any) from the canvas.
 * @param {Object} fRef - React ref to the Fabric canvas instance.
 */
export function handleDeleteImage(fRef) {
  const f = fRef.current;
  if (!f) return;

  const activeObj = f.getActiveObject();
  if (activeObj) {
    f.remove(activeObj);
    f.renderAll();
  }
}

/**
 * Toggle lock/unlock state of the selected object.
 * @param {Object} fRef - React ref to the Fabric canvas instance.
 */
export function handleToggleLock(fRef) {
  const f = fRef.current;
  if (!f) return;

  const activeObj = f.getActiveObject();
  if (!activeObj) return;

  const isLocked = activeObj.lockMovementX && activeObj.lockMovementY;
  activeObj.set({
    lockMovementX: !isLocked,
    lockMovementY: !isLocked,
    lockScalingX: !isLocked,
    lockScalingY: !isLocked,
    lockRotation: !isLocked,
    hasControls: isLocked ? true : false,
    selectable: isLocked ? true : false,
  });

  f.renderAll();
}
