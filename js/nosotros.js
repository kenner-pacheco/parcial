document.getElementById("inicio").onclick = () => {
  window.location.href = "pagina.html";
};

document.getElementById("productos").onclick = () => {
  window.location.href = "productos.html";
};

document.getElementById("nosotros").onclick = () => {
  window.location.href = "nosotros.html";
};

document.getElementById("contactanos").onclick = () => {
  window.location.href = "contactanos.html";
};

document.getElementById("cerrar_sesion").onclick = () => {
  localStorage.removeItem("usuario");
  window.location.href = "../index.html";
};