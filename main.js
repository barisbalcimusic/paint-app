//selecting tools
const main = document.querySelector(".main");
const sidebar = document.querySelector(".sidebar");
const tools = document.querySelectorAll(".tool");
const field = document.getElementById("field");

sidebar.firstElementChild.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) {
    tools.forEach((el) => {
      el.style.color = "unset";
    });
    e.target.style.color = "lightblue";
    field.style.cursor = `url('./img/${e.target.id}.png'), auto`;
  }
});

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth - 50;
canvas.height = window.innerHeight - 50;

let isDrawing = false;

field.addEventListener("mousedown", (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX - 50, e.clientY - 50);
});

field.addEventListener("mousemove", (e) => {
  if (isDrawing) {
    ctx.lineTo(e.clientX - 50, e.clientY - 50);
    ctx.stroke();
  }
});

field.addEventListener("mouseup", (e) => {
  isDrawing = false;
});
