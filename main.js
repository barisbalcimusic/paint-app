const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const tools = document.querySelectorAll(".tool");
const field = document.getElementById("field");

//select any tool
sidebar.firstElementChild.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) {
    tools.forEach((el) => {
      el.style.color = "unset";
    });
    e.target.style.color = "lightblue";
    field.style.cursor = `url('./img/${e.target.id}.png'), auto`;
  }
});

//create canvas
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = screen.width;
canvas.height = screen.height;

//some initial status
let isDrawing = false;

//drawing
field.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
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

//color change
const colorPalette = main.querySelector(".color-palette");
colorPalette.addEventListener("change", (e) => {
  ctx.strokeStyle = e.target.value;
});
