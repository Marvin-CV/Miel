
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const showSignupBtn = document.getElementById('showSignup');
const showLoginBtn = document.getElementById('showLogin');

// Registrarte
showSignupBtn.addEventListener('click', () => {
    loginForm.classList.add('hidden');
    signupForm.classList.remove('hidden');
});

// Iniciar sesión
showLoginBtn.addEventListener('click', () => {
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

// Manejar el envío del formulario de registro
signupForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario de registro
    const nombre = signupForm.querySelector('input[name="nombre"]').value;
    const email = signupForm.querySelector('input[name="email"]').value;
    const contraseña = signupForm.querySelector('input[name="contraseña"]').value;

    try {
        // Enviar la solicitud de registro al backend
        const response = await fetch('/api/registrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, contraseña }),
        });

        const data = await response.json();

        // Manejar la respuesta del backend
        if (response.ok) {
            alert(data.message); // Mostrar mensaje de éxito
            loginForm.classList.remove('hidden'); // Cambiar al formulario de inicio de sesión
            signupForm.classList.add('hidden'); // Ocultar el formulario de registro
        } else {
            alert(data.error); // Mostrar mensaje de error para saber cual era el error en específico
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al registrar el usuario'); // Mostrar mensaje de error 
    }
});

// Manejar el envío del formulario de inicio de sesión
loginForm.querySelector('form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Obtener los valores del formulario de inicio de sesión
    const email = loginForm.querySelector('input[name="email"]').value;
    const contraseña = loginForm.querySelector('input[name="contraseña"]').value;

    try {
        // Enviar la solicitud de inicio de sesión al backend
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, contraseña }),
        });

        const data = await response.json();

        // Manejar la respuesta del backend
        if (response.ok) {
            // Guardar el token en el localStorage
            localStorage.setItem('token', data.token);

            // Redirigir al usuario a la página de usuarios
            window.location.href = data.redirectTo;
        } else {
            alert(data.error); // Mostrar mensaje de error
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al iniciar sesión'); // Mostrar mensaje de error para saber cual es el error en específico
    }
});