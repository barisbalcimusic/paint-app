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
let shapesToggle = false;

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
        unselectShape();
        field.removeEventListener("click", createTextField);
        field.addEventListener("mousedown", drawingStart);
        field.addEventListener("mousemove", drawingProcess);
        break;
      case "eraser":
        field.style.cursor = `url("./img/eraser.png"), auto`;
        unselectShape();
        field.removeEventListener("click", createTextField);
        field.addEventListener("mousedown", drawingStart);
        field.addEventListener("mousemove", drawingProcess);
        break;
      case "select":
        unselectShape();
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
        unselectShape();
        field.removeEventListener("mousedown", drawingStart);
        field.removeEventListener("mousemove", drawingProcess);
        field.addEventListener("click", createTextField);
        break;
      case "zoom-in":
        field.style.cursor = "zoom-in";
        unselectShape();
        break;
      case "zoom-out":
        field.style.cursor = "zoom-out";
        unselectShape();
        break;
      case "highlighter":
        unselectShape();
        break;
      default:
        unselectShape();
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

//unselecting shapes
function unselectShape() {
  shapesToggle = false;
  main.querySelector("#shapes").style.color = "unset";
  main.querySelectorAll(".shapeLabel").forEach((label) => {
    label.style.display = "none";
    label.style.color = "black";
  });
}

//selecting a shape
function selectShape() {
  main.querySelectorAll(".shapeLabel").forEach((label) => {
    label.style.display = "block";
    label.addEventListener("click", (e) => {
      unselectShape();
      drawShape(e.target.getAttribute("for"));
    });
  });
}

//drawing a shape (rectangle or ellipse)
function drawShape(chosenShape) {
  field.style.cursor = "crosshair";
  let startX, startY;
  let width, height;
  let shape;
  field.addEventListener("mousedown", mouseDownHandler);

  function mouseDownHandler(e) {
    startX = e.clientX;
    startY = e.clientY;
    shape = document.createElement("div");
    shape.style.position = "absolute";
    shape.style.border = `1px solid ${currentColor}`;
    shape.style.left = startX + "px";
    shape.style.top = startY + "px";
    main.appendChild(shape);
    if (chosenShape !== "rectangle") {
      shape.style.borderRadius = "50%";
    }

    field.addEventListener("mousemove", mouseMoveHandler);
  }

  function mouseMoveHandler(e) {
    width = e.clientX - startX;
    height = e.clientY - startY;
    shape.style.width = width + "px";
    shape.style.height = height + "px";
    field.addEventListener("mouseup", mouseUpHandler);
  }

  function mouseUpHandler() {
    field.removeEventListener("mousedown", mouseDownHandler);
    field.removeEventListener("mousemove", mouseMoveHandler);
    field.removeEventListener("mouseup", mouseUpHandler);
    field.style.cursor = "default";
    shape.remove();
    let centerX = startX + width / 2;
    let centerY = startY + height / 2;
    ctx.beginPath();
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 0.5;
    chosenShape === "rectangle"
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
}
