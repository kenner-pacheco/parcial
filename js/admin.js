const BIN_ID = "68560fc98960c979a5ae22f8/latest";
const API_KEY = "$2a$10$900ck9WBjqWmdjX5QzvZ8.3S.1JHMbTn1QToeQxbuZoMk8wUrbWYy";
const JSON_BIN_URL = "https://api.jsonbin.io/v3/b/68560fc98960c979a5ae22f8/latest";

const UserStore = {
  key: 'users',

  fetchAll: async () => {
    try {
      const res = await fetch(JSON_BIN_URL, {
        headers: { 'X-Master-Key': API_KEY }
      });
      const data = await res.json();
      const lista = data.record.lista.usuarios;
      localStorage.setItem(UserStore.key, JSON.stringify(lista));
      return lista;
    } catch (e) {
      console.warn("Fallo la carga desde jsonbin.io, usando localStorage.");
      return JSON.parse(localStorage.getItem(UserStore.key) || "[]");
    }
  },

  saveAll: async (usuarios) => {
    const estructura = { lista: { usuarios } };
    try {
      await fetch(JSON_BIN_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Master-Key': API_KEY,
          'X-Bin-Versioning': 'false'
        },
        body: JSON.stringify(estructura)
      });
      localStorage.setItem(UserStore.key, JSON.stringify(usuarios));
    } catch (e) {
      console.error("Error al guardar en jsonbin.io:", e);
    }
  }
};

const checkAuth = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  if (usuario && usuario.nombre) {
    document.getElementById("nombreUsuario").textContent = usuario.nombre;
  } else {
    window.location.href = "../index.html";
  }
};

const handleFormSubmit = async () => {
  const usernameInput  = document.getElementById('username');
  const passwordInput  = document.getElementById('password');
  const userIndexInput = document.getElementById('userIndex');

  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();
  const index    = userIndexInput.value;

  if (!username || !password) {
    alert('Por favor completa todos los campos.');
    return;
  }

  const users = await UserStore.fetchAll();

  if (index === '') {
    users.push({
      usuario: username,
      clave: password,
      nombre: username,
      rol: 'usuario'
    });
  } else {
    users[index] = {
      usuario: username,
      clave: password,
      nombre: users[index].nombre,
      rol: users[index].rol
    };
    userIndexInput.value = '';
    document.getElementById('presionar').textContent = 'Crear Usuario';
  }

  await UserStore.saveAll(users);
  localStorage.setItem("usuario", JSON.stringify({ nombre: username }));
  document.getElementById('userForm').reset();
  renderTable(users);
};

const renderTable = async (preloadedUsers = null) => {
  const users = preloadedUsers || await UserStore.fetchAll();
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '';

  users.forEach((user, i) => {
    const tr = document.createElement('tr');

    const tdUsuario = document.createElement('td');
    tdUsuario.textContent = user.usuario;

    const tdClave = document.createElement('td');
    tdClave.textContent = user.clave;

    const tdNombre = document.createElement('td');
    tdNombre.textContent = user.nombre;

    const tdRol = document.createElement('td');
    tdRol.textContent = user.rol;

    const tdActions = document.createElement('td');
    tdActions.classList.add('actions');

    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'Editar';
    btnEdit.className = 'btn btn-edit';
    btnEdit.onclick = () => editUser(i);

    const btnDelete = document.createElement('button');
    btnDelete.textContent = 'Eliminar';
    btnDelete.className = 'btn btn-delete';
    btnDelete.onclick = () => deleteUser(i);

    tdActions.append(btnEdit, btnDelete);
    tr.append(tdUsuario, tdClave, tdNombre, tdRol, tdActions);
    tbody.appendChild(tr);
  });
};

const editUser = index => {
  const users = JSON.parse(localStorage.getItem(UserStore.key));
  const user = users[index];
  document.getElementById('username').value  = user.usuario;
  document.getElementById('password').value  = user.clave;
  document.getElementById('userIndex').value = index;
  document.getElementById('presionar').textContent = 'Actualizar Usuario';

  localStorage.setItem("usuario", JSON.stringify({ nombre: user.nombre }));
  document.getElementById("nombreUsuario").textContent = user.nombre;
};

const deleteUser = async (index) => {
  const users = JSON.parse(localStorage.getItem(UserStore.key));
  if (!confirm('¿Seguro que deseas eliminar este usuario?')) return;

  const removed = users.splice(index, 1)[0];
  await UserStore.saveAll(users);
  renderTable(users);

  const current = JSON.parse(localStorage.getItem("usuario"))?.nombre;
  if (current === removed.nombre) {
    localStorage.removeItem("usuario");
    window.location.href = "../index.html";
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  checkAuth();
  await renderTable();
  document.getElementById('presionar').onclick = handleFormSubmit;
});