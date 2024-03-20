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
let isDrawing = false;
let currentColor = "black";
let shapesToggle = false;

//color change
const colorPalette = main.querySelector(".color-palette");
colorPalette.addEventListener("change", (e) => {
  currentColor = e.target.value;
  document.getElementById("pen").click();
  draw();
});

//select any tool
sidebar.firstElementChild.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) {
    tools.forEach((el) => {
      el.style.color = "unset";
    });
    e.target.style.color = "lightblue";

    switch (e.target.id) {
      case "pen":
        field.style.cursor = "crosshair";
        unselectShape();
        draw();
        break;
      case "eraser":
        field.style.cursor = `url("./img/eraser.png"), auto`;
        unselectShape();
        erase();
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
        addText();
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

//drawing
function draw() {
  field.addEventListener("mousedown", (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 1;
  });

  field.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }
  });

  field.addEventListener("mouseup", (e) => {
    isDrawing = false;
    ctx.strokeStyle = null;
  });
}

//erase
function erase() {
  field.addEventListener("mousedown", (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 30;
  });

  field.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      ctx.lineTo(e.clientX, e.clientY);
      ctx.stroke();
    }
  });

  field.addEventListener("mouseup", (e) => {
    isDrawing = false;
    ctx.strokeStyle = null;
  });
}

//adding text
function addText() {
  field.addEventListener("click", createTextField);
}

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

function convertToCanvasText(fSize, tColor, fFamily, x, y, textField) {
  ctx.font = `${fSize}px ${fFamily}`;
  textField.addEventListener("blur", () => {
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
