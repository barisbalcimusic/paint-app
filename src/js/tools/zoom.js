// import utils
import { canvas, ctx } from "../utils/domElements.js";

//Declare functions for Zooming in/out
export const zoomIn = (e) => zoom(e, 1.1);
export const zoomOut = (e) => zoom(e, 0.9);

//Zooming in/out
const zoom = (e, factor) => {
  const x = e.offsetX;
  const y = e.offsetY;

  //Draw current canvas onto a second canvas "resizedCanvas"
  const newWidth = canvas.width * factor;
  const newHeight = canvas.height * factor;
  const resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = newWidth;
  resizedCanvas.height = newHeight;
  const resizedCtx = resizedCanvas.getContext("2d");
  resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);

  //Clear current canvas, save settings, move according to mouse-location
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-x * (factor - 1), -y * (factor - 1));
  ctx.scale(factor, factor);

  //Draw "resizedCanvas" onto current canvas, restore settings
  ctx.drawImage(resizedCanvas, 0, 0);
  ctx.restore();
};
