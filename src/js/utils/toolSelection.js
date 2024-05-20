// import utils
import { sidebar, tools, field } from "./domElements.js";
import { global } from "./globalState.js";
import { cleanUp } from "./cleanUp.js";

// import tools
import { drawingStart } from "../tools/penEraser.js";
import { createTextField } from "../tools/text.js";
import { selectShape } from "../tools/shapes.js";
import { zoomIn, zoomOut } from "../tools/zoom.js";

//highlighting active tool
export const highlightActiveTool = () => {
  sidebar.firstElementChild.addEventListener("click", (e) => {
    tools.forEach((tool) => tool.classList.remove("active-tool"));
    e.target.classList.add("active-tool");
    if (e.target.id !== "color") global.selectedTool = e.target.id;
    cleanUp();
    selectTool();
  });
};

//selecting cursor
export const changeCursor = (cursorName) => {
  field.style.cursor = cursorName;
  global.lastCursor = cursorName;
};

//tool selection
export const selectTool = () => {
  switch (global.selectedTool) {
    case "pen":
      changeCursor("crosshair");
      field.addEventListener("mousedown", drawingStart);
      break;
    case "eraser":
      changeCursor(`url("./src/images/eraser.png"), auto`);
      field.addEventListener("mousedown", drawingStart);
      break;
    case "shapes":
      changeCursor("auto");
      selectShape();
      break;
    case "text":
      changeCursor("text");
      field.addEventListener("click", createTextField);
      break;
    case "zoom-in":
      changeCursor("zoom-in");
      field.addEventListener("click", zoomIn);
      break;
    case "zoom-out":
      changeCursor("zoom-out");
      field.addEventListener("click", zoomOut);
      break;
    default:
      changeCursor("lastCursor");
      break;
  }
};
