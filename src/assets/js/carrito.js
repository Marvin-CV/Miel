const contenedorCarritoVacio = document.querySelector("#carrito-vacio");
const contenedorCarritoProductos = document.querySelector("#carrito-productos");
const contenedorCarritoAcciones = document.querySelector("#carrito-acciones");
const contenedorCarritoComprado = document.querySelector("#carrito-comprado");
const botonVaciar = document.querySelector("#carrito-acciones-vaciar");
const contenedorTotal = document.querySelector("#total");
const botonComprar = document.querySelector("#carrito-acciones-comprar");

async function cargarProductosCarrito() {
    try {
        const response = await fetch('/api/cart');
        const productosEnCarrito = await response.json();
        console.log("Productos en el carrito obtenidos:", productosEnCarrito); // 👀 Verificación

        if (productosEnCarrito.length > 0) {
            contenedorCarritoVacio.classList.add("disable");
            contenedorCarritoProductos.classList.remove("disable");
            contenedorCarritoAcciones.classList.remove("disable");
            contenedorCarritoComprado.classList.add("disable");

            contenedorCarritoProductos.innerHTML = ""; // Limpiar antes de añadir los nuevos elementos

            productosEnCarrito.forEach(producto => {
                const div = document.createElement("div");
                div.classList.add("carrito-producto");
                div.innerHTML = `
                    <img class="producto-carrito-img" src="${producto.imagen}" alt="${producto.titulo}">
                    <div class="carrito-producto-titulo">
                        <small>Título</small>
                        <h3>${producto.titulo}</h3>
                    </div>
                    <div class="carrito-producto-cantidad">
                        <small>Cantidad</small>
                        <p>${producto.quantity}</p>
                    </div>
                    <div class="carrito-producto-precio">
                        <small>Precio</small>
                        <p>$${producto.precio}</p>
                    </div>
                    <div class="carrito-producto-subtotal">
                        <small>Subtotal</small>
                        <p>$${(producto.precio * producto.quantity).toFixed(2)}</p>
                    </div>
                    <button class="carrito-producto-eliminar" data-product-id="${producto.product_id}">
                        <i class='bx bx-trash-alt'></i>
                    </button>
                `;
                contenedorCarritoProductos.appendChild(div);
            });
        } else {
            contenedorCarritoVacio.classList.remove("disable");
            contenedorCarritoProductos.classList.add("disable");
            contenedorCarritoAcciones.classList.add("disable");
            contenedorCarritoComprado.classList.add("disable");
        }

        actualizarEliminar();
        actualizarTotal();
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}


function actualizarEliminar() {
    const botonesEliminar = document.querySelectorAll(".carrito-producto-eliminar");
    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarDelCarrito);
    });
}

async function eliminarDelCarrito(e) {
    const productId = e.currentTarget.getAttribute("data-product-id");
    try {
        const response = await fetch(`/api/cart/delete/${productId}`, { method: 'DELETE' });
        const data = await response.json();
        console.log(data);
        cargarProductosCarrito();
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

async function vaciarCarrito() {
    try {
        const response = await fetch('/api/cart/clear', { method: 'DELETE' });
        const data = await response.json();
        console.log(data);
        cargarProductosCarrito();
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
    }
}

// Función para obtener los productos del carrito
async function obtenerProductosDelCarrito() {
    const response = await fetch('/api/cart');
    const productosEnCarrito = await response.json();
    return productosEnCarrito;
  }
  
  // Función para calcular el total del carrito
  async function calcularTotal() {
    const response = await fetch('/api/cart');
    const productosEnCarrito = await response.json();
    const totalCalculado = productosEnCarrito.reduce(
      (acc, prod) => acc + (prod.precio * prod.quantity),
      0
    );
    return totalCalculado;
  }
  

  async function comprarCarrito() {
    try {
        const response = await fetch('/api/cart/checkout', { 
           method: 'POST',
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({ 
              cartItems: await obtenerProductosDelCarrito(), // obtenemos los productos del carrito
              total: await calcularTotal()  // usamos await para obtener el total correcto
           })
        });
        const data = await response.json();
        console.log(data);
        // Actualizamos la vista: vacíamos el carrito y mostramos mensaje de compra exitosa.
        contenedorCarritoVacio.classList.add("disable");
        contenedorCarritoProductos.classList.add("disable");
        contenedorCarritoAcciones.classList.add("disable");
        contenedorCarritoComprado.classList.remove("disable");
    } catch (error) {
        console.error('Error al procesar la compra:', error);
        alert('Error en la compra: ' + error.message);
    }
}



function actualizarTotal() {
    fetch('/api/cart')
        .then(response => response.json())
        .then(productosEnCarrito => {
            const totalCalculado = productosEnCarrito.reduce((acc, prod) => acc + (prod.precio * prod.quantity), 0);
            contenedorTotal.innerText = `$${totalCalculado.toFixed(2)}`;
        });
}

botonVaciar.addEventListener("click", vaciarCarrito);
botonComprar.addEventListener("click", comprarCarrito);

document.addEventListener('DOMContentLoaded', cargarProductosCarrito);
// async function comprarCarrito() {
//     try {
//         const response = await fetch('/api/cart/checkout', { method: 'POST' });
//         const data = await response.json();
//         console.log(data);
//         contenedorCarritoVacio.classList.add("disable");
//         contenedorCarritoProductos.classList.add("disable");
//         contenedorCarritoAcciones.classList.add("disable");
//         contenedorCarritoComprado.classList.remove("disable");
//     } catch (error) {
//         console.error('Error al procesar la compra:', error);
//         alert('Error en la compra: ' + error.message);
//     }
// }