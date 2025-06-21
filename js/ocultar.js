document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById('toggleBtn');
  const contenedor = document.getElementById('contenedorMultimedia');

  toggleBtn.onclick = () => {
    const visible = contenedor.style.display == 'flex';
    contenedor.style.display = visible ? 'none' : 'flex';
    toggleBtn.textContent = visible
      ? 'Mostrar mapa y video'
      : 'Ocultar mapa y video';
  };
});