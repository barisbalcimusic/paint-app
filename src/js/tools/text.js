// import utils
import { ctx, main } from "../utils/domElements.js";
import { global } from "../utils/globalState.js";

//create textarea as preview
export const createTextField = (e) => {
  const { clientX: x, clientY: y } = e;
  const textField = document.createElement("textarea");
  textField.className = "text-field";
  main.append(textField);
  textField.focus();
  const tColor = `${global.currentColor}`;
  const fSize = "20";
  const fFamily = "Arial";
  textField.style.cssText = `
      top: ${y}px;
      left: ${x}px;
      color:${tColor};
      font-size: ${fSize}px;
      font-family: ${fFamily}`;
  convertToCanvasText(fSize, tColor, fFamily, x, y, textField);
};

//convert textarea to canvas-text
export const convertToCanvasText = (
  fSize,
  tColor,
  fFamily,
  x,
  y,
  textField
) => {
  textField.addEventListener("blur", () => {
    ctx.font = `${fSize}px ${fFamily}`;
    ctx.fillStyle = tColor;
    ctx.fillText(textField.value, x + 5, y + 20);
    textField.remove();
  });
};
