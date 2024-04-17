//some selectings
const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const tools = document.querySelectorAll(".tool");
const field = document.getElementById("field");

//create canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.fillStyle = "white";
ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

//resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//some initial status
let selectedTool;
let isDrawing = false;
let currentColor = "black";
let shapesToggle = false;

//----------- COLOR CHANGE -----------
const colorPalette = main.querySelector(".color-palette");
colorPalette.addEventListener("change", (e) => {
  currentColor = e.target.value;
  switchTool();
});

//----------- TOOL SELECTING -----------
sidebar.firstElementChild.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) {
    tools.forEach((el) => {
      el.style.color = "unset";
    });
    e.target.style.color = "lightblue";
    if (e.target.id !== "") {
      selectedTool = e.target.id;
    }
    removeAllEventListeners();
    console.log(selectedTool);
    switchTool();
  }
});

function switchTool() {
  switch (selectedTool) {
    case "pen":
      field.style.cursor = "crosshair";
      field.addEventListener("mousedown", drawingStart);
      break;
    case "eraser":
      field.style.cursor = `url("./img/eraser.png"), auto`;
      field.addEventListener("mousedown", drawingStart);
      break;
    case "select":
      break;
    case "shapes":
      field.style.cursor = "auto";
      if (!shapesToggle) {
        shapesToggle = true;
        selectShape();
      } else {
        unselectShape();
      }
      break;
    case "text":
      field.style.cursor = "text";
      field.addEventListener("click", createTextField);
      break;
    case "zoom-in":
      field.style.cursor = "zoom-in";
      field.addEventListener("click", zoomIn);
      break;
    case "zoom-out":
      field.style.cursor = "zoom-out";
      field.addEventListener("click", zoomOut);
      break;
    case "highlighter":
      break;
    default:
      break;
  }
}

//remove all event listeners
function removeAllEventListeners() {
  unselectShape();
  unselectZoom();
  field.removeEventListener("click", createTextField);
  field.removeEventListener("mousedown", drawingStart);
  if (
    !["shapes", "rectLabel", "rectangle", "circLabel", "circle"].includes(
      selectedTool
    )
  ) {
    field.removeEventListener("mousedown", startShape);
  }
}

//start drawing with pen/eraser
function drawingStart(e) {
  isDrawing = true;
  field.addEventListener("mousemove", drawingProcess);
  field.addEventListener("mouseup", drawingStop);
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  switch (selectedTool) {
    case "pen":
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 1;
      break;
    case "eraser":
      ctx.strokeStyle = "white";
      ctx.lineWidth = 30;
      break;
    case "text":
      break;
    default:
      break;
  }
}

//perform drawing with pen/eraser
function drawingProcess(e) {
  if (isDrawing) {
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  }
}

//stop drawing with pen/eraser
function drawingStop() {
  isDrawing = false;
  field.removeEventListener("mousemove", drawingProcess);
}

//----------- ADDING TEXT -----------
//create textarea as preview
function createTextField(e) {
  const x = e.clientX;
  const y = e.clientY;
  const textField = document.createElement("textarea");
  textField.setAttribute("class", "text-field");
  main.append(textField);
  textField.focus();
  //initial values
  const tColor = "black";
  const fSize = "20";
  const fFamily = "Arial";
  textField.style.cssText = `
    position: absolute;
    top: ${y}px;
    left: ${x}px;
    color:${tColor};
    font-size: ${fSize}px;
    font-family: ${fFamily}`;
  convertToCanvasText(fSize, tColor, fFamily, x, y, textField);
}

//convert textarea to canvas-text
function convertToCanvasText(fSize, tColor, fFamily, x, y, textField) {
  textField.addEventListener("blur", () => {
    ctx.font = `${fSize}px ${fFamily}`;
    ctx.fillStyle = tColor;
    ctx.fillText(textField.value, x + 5, y + 20);
    textField.remove();
  });
}

//----------- SHAPE SELECTION -----------

//prepare shapes
let startX, startY;
let width, height;
let shape, currentShape;

//unselect shapes
function unselectShape() {
  shapesToggle = false;
  main.querySelector("#shapes").style.color = "unset";
  main.querySelectorAll(".shapeLabel").forEach((label) => {
    label.style.display = "none";
    label.style.color = "black";
  });
}

//select shape
function selectShape() {
  main.querySelectorAll(".shapeLabel").forEach((label) => {
    label.style.display = "block";
    label.addEventListener("click", (e) => {
      unselectShape();
      currentShape = e.target.getAttribute("for");
      field.style.cursor = "crosshair";
      field.addEventListener("mousedown", startShape);
    });
  });
}

//start drawing shape
function startShape(e) {
  startX = e.clientX;
  startY = e.clientY;
  shape = document.createElement("div");
  shape.style.position = "absolute";
  shape.style.border = `1px solid ${currentColor}`;
  shape.style.left = startX + "px";
  shape.style.top = startY + "px";
  main.appendChild(shape);
  if (currentShape !== "rectangle") {
    shape.style.borderRadius = "50%";
  }
  if (e.buttons !== 1) return;
  field.addEventListener("mousemove", moveShape);
  field.addEventListener("mouseup", endShape);
}

//perform drawing shape
function moveShape(e) {
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
}

//stop drawing shape
function endShape() {
  field.removeEventListener("mousedown", startShape);
  field.removeEventListener("mousemove", moveShape);
  field.removeEventListener("mouseup", endShape);
  field.style.cursor = "default";
  shape.remove();
  let centerX = startX + width / 2;
  let centerY = startY + height / 2;
  ctx.beginPath();
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 0.5;
  currentShape === "rectangle"
    ? ctx.rect(startX, startY, width, height)
    : ctx.ellipse(
        centerX,
        centerY,
        Math.abs(width) / 2,
        Math.abs(height) / 2,
        0,
        0,
        2 * Math.PI
      );
  ctx.stroke();
}

//----------- ZOOM -----------
//Unselect Zoom
const unselectZoom = () => {
  field.removeEventListener("click", zoomIn);
  field.removeEventListener("click", zoomOut);
};

//Declare functions for Zooming in/out
const zoomIn = (e) => {
  zoom(e, 1.1);
};
const zoomOut = (e) => {
  zoom(e, 0.9);
};

//Zooming in/out
const zoom = (e, zoomFactor) => {
  const x = e.offsetX;
  const y = e.offsetY;
  //Draw current canvas to a second canvas "resizedCanvas"
  const resizedCanvas = document.createElement("canvas");
  const resizedCtx = resizedCanvas.getContext("2d");
  const newWidth = canvas.width * zoomFactor;
  const newHeight = canvas.height * zoomFactor;
  resizedCanvas.width = newWidth;
  resizedCanvas.height = newHeight;
  resizedCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
  //Clear current canvas, save settings, move according to mouseclick-location
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();
  ctx.translate(-x * (zoomFactor - 1), -y * (zoomFactor - 1));
  ctx.scale(zoomFactor, zoomFactor);
  //Draw "resizedCanvas" onto current canvas, restore settings
  ctx.drawImage(resizedCanvas, 0, 0);
  ctx.restore();
};

//----------- MENUBAR -----------
//save
const saveBtn = document.getElementById("save");
saveBtn.addEventListener("click", () => {
  const dataURL = canvas.toDataURL("image/jpeg");
  let a = document.createElement("a");
  a.href = dataURL;
  a.download = "image.jpg";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});

//about
const about = document.getElementById("about");
about.addEventListener("click", () => {
  const info = document.getElementById("info");
  info.style.display = "flex";
});

field.addEventListener("click", () => {
  info.style.display = "none";
});
