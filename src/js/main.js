// import utils
import { setupCanvas } from "./utils/canvas.js";
import { highlightActiveTool, selectTool } from "./utils/toolSelection.js";
import { changeColor } from "./tools/color.js";
import { menuSave, menuAbout } from "./utils/menu.js";

// initialize canvas
setupCanvas();

// initialize tool selection
highlightActiveTool();
selectTool();
changeColor();

// initialize menu bar
menuSave();
menuAbout();
