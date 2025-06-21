const usuario = JSON.parse(localStorage.getItem("usuario"));
if (usuario) {
  const nombreElemento = document.getElementById("nombreUsuario");
  if (nombreElemento) {
    nombreElemento.textContent = usuario.nombre;
  }
} else {
  window.location.href = "../index.html";
}