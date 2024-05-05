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

//resize canvas
window.addEventListener("resize", () => {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  canvas.width = screen.width;
  canvas.height = screen.height;
  ctx.putImageData(imageData, 0, 0);
});

//some initial status
let selectedTool;
let isDrawing = false;
let currentColor = "black";
let shapesToggle = false;

//----------- TOOL SELECTING -----------

//highlighting active tool
sidebar.firstElementChild.addEventListener("click", (e) => {
  tools.forEach((tool) => tool.classList.remove("active-tool"));
  e.target.classList.add("active-tool");
  if (e.target.id !== "color") selectedTool = e.target.id;
  cleanUp();
  selectTool();
});

//selecting cursor
let lastCursor;
const changeCursor = (cursorName) => {
  field.style.cursor = cursorName;
  lastCursor = cursorName;
};

//tool selection
function selectTool() {
  switch (selectedTool) {
    case "pen":
      changeCursor("crosshair");
      field.addEventListener("mousedown", drawingStart);
      break;
    case "eraser":
      changeCursor(`url("./images/eraser.png"), auto`);
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
}

//changing color
const colorPalette = main.querySelector(".color-palette");
colorPalette.addEventListener("change", (e) => {
  currentColor = e.target.value;
  selectTool();
});

//clean up eventListeners and shapesPopUp
function cleanUp() {
  field.removeEventListener("click", zoomIn);
  field.removeEventListener("click", zoomOut);
  field.removeEventListener("click", createTextField);
  field.removeEventListener("mousedown", drawingStart);
  shapesToggle = false;
  shapesPopUp.style.display = "none";
  shapesPopUp.removeEventListener("click", prepareShape);
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
  ctx.moveTo(e.clientX + window.scrollX, e.clientY + window.scrollY);
  selectedTool === "pen"
    ? ((ctx.strokeStyle = currentColor), (ctx.lineWidth = 1))
    : ((ctx.strokeStyle = "white"), (ctx.lineWidth = 30));
}

//perform drawing with pen/eraser
function drawingProcess(e) {
  if (isDrawing) {
    ctx.lineTo(e.clientX + window.scrollX, e.clientY + window.scrollY);
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
  const { clientX: x, clientY: y } = e;
  const textField = document.createElement("textarea");
  textField.className = "text-field";
  main.append(textField);
  textField.focus();
  const tColor = `${currentColor}`;
  const fSize = "20";
  const fFamily = "Arial";
  textField.style.cssText = `
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
let startX, startY, width, height, shape, currentShape;

//select shape
const shapesPopUp = main.querySelector(".shapes-pop-up");
function selectShape() {
  shapesToggle = !shapesToggle;
  if (shapesToggle) {
    shapesPopUp.style.display = "flex";
    shapesPopUp.addEventListener("click", prepareShape);
  }
}

// prepare shape
function prepareShape(e) {
  shapesPopUp.style.display = "none";
  currentShape = e.target.id;
  changeCursor("crosshair");
  shapesToggle = false;
  field.addEventListener("mousedown", startShape);
}

//start drawing shape
function startShape(e) {
  startX = e.clientX;
  startY = e.clientY;
  shape = document.createElement("div");
  shape.style.cssText = `position: absolute; 
  border: 2px solid ${currentColor}; 
  left: ${startX}px; 
  top: ${startY}px; 
  ${currentShape !== "rectangle" ? "border-radius: 50%;" : null}`;
  main.appendChild(shape);
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
  shape.style.borderColor = `${currentColor}`;
}

//stop drawing shape
function endShape() {
  field.removeEventListener("mousedown", startShape);
  field.removeEventListener("mousemove", moveShape);
  field.removeEventListener("mouseup", endShape);
  changeCursor("default");
  shape.remove();
  ctx.beginPath();
  currentShape === "rectangle"
    ? ctx.rect(startX, startY, width, height)
    : ctx.ellipse(
        startX + width / 2,
        startY + height / 2,
        Math.abs(width) / 2,
        Math.abs(height) / 2,
        0,
        0,
        2 * Math.PI
      );
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;
  ctx.stroke();
}

//----------- ZOOM -----------

//Declare functions for Zooming in/out
const zoomIn = (e) => zoom(e, 1.1);
const zoomOut = (e) => zoom(e, 0.9);

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
