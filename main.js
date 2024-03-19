const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const tools = document.querySelectorAll(".tool");
const field = document.getElementById("field");

//create canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

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
    field.style.cursor = `url('./img/${e.target.id}.png'), auto`;

    switch (e.target.id) {
      case "pen":
        draw();
        break;
      case "eraser":
        erase();
        break;
      case "select":
        break;
      case "shapes":
        break;
      case "text":
        break;
      case "zoom-in":
        break;
      case "zoom-out":
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
    ctx.moveTo(e.clientX - 50, e.clientY - 50);
    ctx.strokeStyle = currentColor;
    ctx.lineWidth = 1;
  });

  field.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      ctx.lineTo(e.clientX - 50, e.clientY - 50);
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
    ctx.moveTo(e.clientX - 50, e.clientY - 50);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 30;
  });

  field.addEventListener("mousemove", (e) => {
    if (isDrawing) {
      ctx.lineTo(e.clientX - 50, e.clientY - 50);
      ctx.stroke();
    }
  });

  field.addEventListener("mouseup", (e) => {
    isDrawing = false;
    ctx.strokeStyle = null;
  });
}
