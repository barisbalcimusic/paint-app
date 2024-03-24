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

//resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

//some initial status
let selectedTool;
let isDrawing = false;
let currentColor = "black";

//----------- COLOR CHANGE -----------
const colorPalette = main.querySelector(".color-palette");
colorPalette.addEventListener("change", (e) => {
  currentColor = e.target.value;
});

//----------- TOOL SELECTING -----------
sidebar.firstElementChild.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) {
    tools.forEach((el) => {
      el.style.color = "unset";
    });
    e.target.style.color = "lightblue";

    selectedTool = e.target.id;
    switch (selectedTool) {
      case "pen":
        field.style.cursor = "crosshair";
        field.removeEventListener("click", createTextField);
        field.addEventListener("mousedown", drawingStart);
        field.addEventListener("mousemove", drawingProcess);
        break;
      case "eraser":
        field.style.cursor = `url("./img/eraser.png"), auto`;
        field.removeEventListener("click", createTextField);
        field.addEventListener("mousedown", drawingStart);
        field.addEventListener("mousemove", drawingProcess);
        break;
      case "select":
        break;
      case "shapes":
        field.style.cursor = "crosshair";
        break;
      case "text":
        field.style.cursor = "text";
        field.removeEventListener("mousedown", drawingStart);
        field.removeEventListener("mousemove", drawingProcess);
        field.addEventListener("click", createTextField);
        break;
      case "zoom-in":
        field.style.cursor = "zoom-in";
        break;
      case "zoom-out":
        field.style.cursor = "zoom-out";
        break;
      case "highlighter":
        break;
      default:
        break;
    }
  }
});

//start drawing with pen/eraser
function drawingStart(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
  switch (selectedTool) {
    case "pen":
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = 1;
      break;
    case "eraser":
      ctx.strokeStyle = "#fff";
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
    field.addEventListener("mouseup", drawingStop);
  }
}

//stop drawing with pen/eraser
function drawingStop() {
  isDrawing = false;
}

//----------- ADDING TEXT -----------
//create textarea as preview
function createTextField(e) {
  const x = e.clientX;
  const y = e.clientY;
  const textField = document.createElement("textarea");
  textField.type = "text";
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
