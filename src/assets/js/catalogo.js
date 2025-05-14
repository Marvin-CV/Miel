const contenedorProductos = document.querySelector("#contenedor-productos");
let productosEncarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

// Función para cargar productos desde la API
async function cargarProductos() {
    try {
        const response = await fetch('/api/productos');
        const productos = await response.json();
        contenedorProductos.innerHTML = '';

        productos.forEach(producto => {
            const div = document.createElement("div");
            div.classList.add("producto");
            div.innerHTML = `
                <img class="img-producto" src="${producto.imagen}" alt="${producto.titulo}">
                <div class="producto-detalle">
                    <h3 class="producto-titulo">${producto.titulo}</h3>
                    <p class="producto-precio">$${producto.precio}</p>
                    <p class="producto-stock">Disponibles: ${producto.stock}</p>
                    <button class="btn producto-agregar" id="${producto.id_producto}" //aqui decia producto.id lo cambie a producto.id_producto y funcionó
                        ${producto.stock <= 0 ? 'disabled' : ''}>
                        <i class='bx bx-cart-add'></i>
                        ${producto.stock <= 0 ? ' Agotado' : 'Agregar'}
                    </button>
                </div>
            `;
            contenedorProductos.appendChild(div);
        });

        // Asignar el evento a cada botón para agregar al carrito
        let botonesAgregar = document.querySelectorAll(".producto-agregar");
        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        contenedorProductos.innerHTML = `
            <div class="error">
                <p>Error al cargar productos: ${error.message}</p>
                <button onclick="cargarProductos()">Reintentar</button>
            </div>
        `;
    }
}

async function agregarAlCarrito(e) {
    const IdBoton = e.currentTarget.id;
    console.log("ID del producto capturado:", IdBoton);  

    // Verificar si el ID del producto es válido
    if (!IdBoton || IdBoton === "undefined") {
        console.error("Error: El ID del producto es inválido.");
        return;
    }

    // Obtener información del producto desde la tarjeta en el DOM
    const productoAgregado = Array.from(document.querySelectorAll('.producto'))
        .map(div => ({
            id: div.querySelector('.producto-agregar').id,
            titulo: div.querySelector('.producto-titulo').textContent,
            imagen: div.querySelector('.img-producto').src,
            precio: parseFloat(div.querySelector('.producto-precio').textContent.replace('$', ''))
        }))
        .find(producto => producto.id === IdBoton);

    if (!productoAgregado) {
        console.error("Error: No se encontró el producto en el DOM.");
        return;
    }

    console.log("Datos del producto a enviar:", productoAgregado); 

    try {
        const resp = await fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: productoAgregado.id, quantity: 1 })
        });

        const data = await resp.json();
        console.log("Respuesta del servidor:", data); 

        if (!resp.ok) {
            throw new Error(data.message || "Error desconocido");
        }

        e.target.innerHTML = '<i class="bx bx-check"></i> ¡Agregado!';
        setTimeout(() => {
            e.target.innerHTML = '<i class="bx bx-cart-add"></i> Agregar';
        }, 1500);
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        alert("Hubo un problema al agregar el producto al carrito.");
    }
}



document.addEventListener('DOMContentLoaded', cargarProductos);
