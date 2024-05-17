// import utils
import { field, ctx } from "../utils/domElements.js";
import { global } from "../utils/globalState.js";

//start drawing with pen/eraser
export const drawingStart = (e) => {
  global.isDrawing = true;
  field.addEventListener("mousemove", drawingProcess);
  field.addEventListener("mouseup", drawingStop);
  ctx.beginPath();
  ctx.moveTo(e.clientX + window.scrollX, e.clientY + window.scrollY);
  global.selectedTool === "pen"
    ? ((ctx.strokeStyle = global.currentColor), (ctx.lineWidth = 1))
    : ((ctx.strokeStyle = "white"), (ctx.lineWidth = 30));
};

//perform drawing with pen/eraser
const drawingProcess = (e) => {
  if (global.isDrawing) {
    ctx.lineTo(e.clientX + window.scrollX, e.clientY + window.scrollY);
    ctx.stroke();
  }
};

//stop drawing with pen/eraser
const drawingStop = () => {
  global.isDrawing = false;
  field.removeEventListener("mousemove", drawingProcess);
};
