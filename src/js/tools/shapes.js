// import utils
import { global } from "../utils/globalState.js";
import { changeCursor } from "../utils/toolSelection.js";
import { field, main, ctx, shapesPopUp } from "../utils/domElements.js";

//prepare shapes
let startX, startY, width, height, shape, currentShape;

//select shape
export const selectShape = () => {
  global.shapesToggle = !global.shapesToggle;
  if (global.shapesToggle) {
    shapesPopUp.style.display = "flex";
    shapesPopUp.addEventListener("click", prepareShape);
  }
};

// prepare shape
export const prepareShape = (e) => {
  shapesPopUp.style.display = "none";
  currentShape = e.target.id;
  changeCursor("crosshair");
  global.shapesToggle = false;
  field.addEventListener("mousedown", startShape);
};

//start drawing shape
export const startShape = (e) => {
  startX = e.clientX;
  startY = e.clientY;
  shape = document.createElement("div");
  shape.style.cssText = `position: absolute; 
  border: 2px solid ${global.currentColor}; 
  left: ${startX}px; 
  top: ${startY}px; 
  ${currentShape !== "rectangle" ? "border-radius: 50%;" : null}`;
  main.appendChild(shape);
  field.addEventListener("mousemove", moveShape);
  field.addEventListener("mouseup", endShape);
};

//perform drawing shape
export const moveShape = (e) => {
  if (e.buttons !== 1) {
    endShape();
    return;
  }
  width = e.clientX - startX;
  height = e.clientY - startY;
  shape.style.width = Math.abs(width) + "px";
  shape.style.height = Math.abs(height) + "px";
  shape.style.left = (width > 0 ? startX : e.clientX) + "px";
  shape.style.top = (height > 0 ? startY : e.clientY) + "px";
  shape.style.borderColor = `${global.currentColor}`;
};

//stop drawing shape
export const endShape = () => {
  field.removeEventListener("mousedown", startShape);
  field.removeEventListener("mousemove", moveShape);
  field.removeEventListener("mouseup", endShape);
  changeCursor("default");
  shape.remove();
  ctx.beginPath();
  currentShape === "rectangle"
    ? ctx.rect(startX, startY, width, height)
    : ctx.ellipse(
        startX + width / 2,
        startY + height / 2,
        Math.abs(width) / 2,
        Math.abs(height) / 2,
        0,
        0,
        2 * Math.PI
      );
  ctx.strokeStyle = global.currentColor;
  ctx.lineWidth = 2;
  ctx.stroke();
};
