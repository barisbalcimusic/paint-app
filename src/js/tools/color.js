// import utils
import { colorPalette } from "../utils/domElements.js";
import { global } from "../utils/globalState.js";

export const changeColor = () => {
  colorPalette.addEventListener("change", (e) => {
    global.currentColor = e.target.value;
    selectTool();
  });
};
