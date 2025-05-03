// Obtener la información del usuario logueado
const obtenerUsuario = async () => {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No se encontró el token. Inicia sesión nuevamente.');
            window.location.href = '/login'; // Redirigir al login si no hay token
            return;
        }

        // Enviar la solicitud al backend con el token en el header
        const response = await fetch('/api/usuario', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token aquí
            },
        });

        const data = await response.json();

        // Manejar la respuesta del backend
        if (response.ok) {
            // Mostrar la información en los labels
            document.getElementById('UsuarioBD').textContent = data.nombre;
            document.getElementById('EmailBD').textContent = data.email;

            // Rellenar los inputs con la información actual del usuario
            document.getElementById('nombreInput').value = data.nombre;
            document.getElementById('emailInput').value = data.email;
        } else {
            alert(data.error); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error obteniendo información del usuario');
    }
};

// Llamar a la función al cargar la página
window.onload = obtenerUsuario;

// Función para actualizar la información del usuario
const actualizarUsuario = async () => {
    const nombre = document.getElementById('nombreInput').value;
    const email = document.getElementById('emailInput').value;

    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No se encontró el token. Inicia sesión nuevamente.');
            window.location.href = '/login'; // Redirigir al login si no hay token
            return;
        }

        // Enviar la solicitud al backend con el token en el header
        const response = await fetch('/api/usuario', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Enviar el token aquí
            },
            body: JSON.stringify({ nombre, email }),
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Mostrar mensaje de éxito
            obtenerUsuario(); // Actualizar la información mostrada
        } else {
            alert(data.error); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error actualizando el usuario');
    }
};

// Asignar la función al botón de actualizar
document.getElementById('actualizarBtn').addEventListener('click', actualizarUsuario);

// Función para eliminar el usuario
const eliminarUsuario = async () => {
    try {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (!token) {
            alert('No se encontró el token. Inicia sesión nuevamente.');
            window.location.href = '/login'; // Redirigir al login si no hay token
            return;
        }

        // Enviar la solicitud al backend con el token en el header
        const response = await fetch('/api/usuario', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Enviar el token aquí
            },
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message); // Mostrar mensaje de éxito
            window.location.href = '/login'; // Redirigir al login
        } else {
            alert(data.error); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error eliminando el usuario');
    }
};

// Asignar la función al botón de eliminar
document.getElementById('eliminarBtn').addEventListener('click', eliminarUsuario);

const editButton = document.getElementById("edit-button");
const card2 = document.getElementById("card-2");

editButton.addEventListener("click", () => {
  // Alternar visibilidad de card-2
  card2.classList.toggle("hidden");
  
  // Alternar clase "active" en el botón
  editButton.classList.toggle("active");
  
  // Cambiar texto del botón (opcional)
  if (card2.classList.contains("hidden")) {
    editButton.classList.add("btn-secundary");
    editButton.classList.remove("btn-focus");
    editButton.textContent = "Editar perfil";
  } else {
    editButton.classList.add("btn-focus");
    editButton.textContent = "Cerrar";
    editButton.classList.remove("btn-secundary");
  }
});