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

// hier kommt später Code von Hannah hin

field.addEventListener("mousedown", () => {
  field.style.backgroundColor = "red";
});

field.addEventListener("mouseup", () => {
  field.style.backgroundColor = "white";
});

alert("baris hier");
