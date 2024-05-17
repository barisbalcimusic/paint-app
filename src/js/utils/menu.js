// import utils
import { canvas, field, saveBtn, aboutBtn } from "./domElements.js";

//save
export const menuSave = () => {
  saveBtn.addEventListener("click", () => {
    const dataURL = canvas.toDataURL("image/jpeg");
    let a = document.createElement("a");
    a.href = dataURL;
    a.download = "image.jpg";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
};

//about

export const menuAbout = () => {
  aboutBtn.addEventListener("click", () => {
    const info = document.getElementById("info");
    info.style.display = "flex";
  });

  field.addEventListener("click", () => {
    info.style.display = "none";
  });
};
