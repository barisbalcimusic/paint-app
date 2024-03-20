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
        draw();
        break;
      case "eraser":
        field.style.cursor = `url("./img/eraser.png"), auto`;
        erase();
        break;
      case "select":
        break;
      case "shapes":
        field.style.cursor = "crosshair";
        break;
      case "text":
        field.style.cursor = "text";
        addText();
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
