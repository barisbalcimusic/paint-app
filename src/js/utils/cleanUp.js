// import utils
import { field, shapesPopUp } from "./domElements.js";
import { global } from "./globalState.js";

// import tools
import { drawingStart } from "../tools/penEraser.js";
import { createTextField } from "../tools/text.js";
import { startShape, prepareShape } from "../tools/shapes.js";
import { zoomIn, zoomOut } from "../tools/zoom.js";

//clean up eventListeners and shapesPopUp
export const cleanUp = () => {
  field.removeEventListener("click", zoomIn);
  field.removeEventListener("click", zoomOut);
  field.removeEventListener("click", createTextField);
  field.removeEventListener("mousedown", drawingStart);
  global.shapesToggle = false;
  shapesPopUp.style.display = "none";
  shapesPopUp.removeEventListener("click", prepareShape);
  if (
    !["shapes", "rectLabel", "rectangle", "circLabel", "circle"].includes(
      global.selectedTool
    )
  ) {
    field.removeEventListener("mousedown", startShape);
  }
};
