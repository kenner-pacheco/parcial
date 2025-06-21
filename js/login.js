const login = () => {
  const user = document.getElementById("usuario").value;
  const clave = document.getElementById("password").value;

  if (user == "" || clave == "") {
    alert("Todos los campos son obligatorios");
    return;
  }

  fetch("https://api.jsonbin.io/v3/b/68560fc98960c979a5ae22f8/latest")  
    .then(res => res.json())
    .then(data => {
      const usuarioValido = data.record.lista.usuarios.find(
        u => u.usuario == user && u.clave == clave
      );

      if (usuarioValido) {
        localStorage.setItem("usuario", JSON.stringify(usuarioValido));

        if (usuarioValido.rol == "admin") {
          window.location.href = "html/admin.html";
        } else {
          window.location.href = "html/pagina.html";
        }
      } else {
        alert("Usuario o contraseña incorrectos");
      }
    })
    .catch(error => {
      console.error("Error al acceder a JSONBin:", error);
      alert("No se pudo conectar con el servidor.");
    });
};