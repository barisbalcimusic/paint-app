// import utils
import { canvas, ctx } from "./domElements.js";

export const setupCanvas = () => {
  //setup canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

  //resize canvas
  window.addEventListener("resize", () => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = screen.width;
    canvas.height = screen.height;
    ctx.putImageData(imageData, 0, 0);
  });
};
