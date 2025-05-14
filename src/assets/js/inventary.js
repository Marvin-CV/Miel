// pusimos bastantes consoles.log para ver donde estaban surgiendo los errores y las partes de codigo comentadas son las que no funcionaban pero las usamos para mejorarlas
async function cargarInventario() {
    try {
        const response = await fetch('/api/inventario');
        const productos = await response.json();
        console.log("✔ Productos cargados:", productos);

        const tabla = document.querySelector("#tabla-inventario");

        if (!tabla) {
            console.error(" Error: No se encontró el <tbody> en el DOM.");
            return;
        }

        tabla.innerHTML = ""; 

        productos.forEach(producto => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${producto.id_producto}</td>
                <td>${producto.titulo}</td>
                <td>$${producto.precio}</td>
                <td>${producto.stock}</td>
                <td>Activo</td>
                <td>
                    <button class="btn-ico-success editar-producto" data-product-id="${producto.id_producto}"><i class='bx bx-edit'></i></button>
                    <button class="btn-ico-danger eliminar-producto" data-product-id="${producto.id_producto}"><i class='bx bx-trash-alt'></i></button>
                </td>
            `;
            tabla.appendChild(tr);
        });

        asignarEventos();
    } catch (error) {
        console.error("Error al cargar el inventario:", error);
    }
}

document.addEventListener("DOMContentLoaded", cargarInventario);


document.addEventListener("DOMContentLoaded", cargarInventario);

document.querySelector("#actualizarBtn").addEventListener("click", async () => {
    const id = document.querySelector("#codigoproducto").value;
    const titulo = document.querySelector("#nombreproducto").value;
    const precio = parseFloat(document.querySelector("#precioproducto").value);
    const stock = parseInt(document.querySelector("#stockproducto").value);

    try {
        const resp = await fetch('/api/inventario', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, titulo, precio, stock })
        });

        const data = await resp.json();
        console.log("Producto agregado:", data);
        cargarInventario();
    } catch (error) {
        console.error("Error al agregar el producto:", error);
    }
});

document.querySelectorAll(".editar-producto").forEach(boton => {
    boton.addEventListener("click", async () => {
        const id_producto = boton.getAttribute("data-product-id");

        const titulo = prompt("Nuevo nombre del producto:");
        const precio = parseFloat(prompt("Nuevo precio:"));
        const stock = parseInt(prompt("Nuevo stock:"));

        try {
            const resp = await fetch(`/api/inventario/${id_producto}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titulo, precio, stock })
            });

            const data = await resp.json();
            console.log("Producto actualizado:", data);
            cargarInventario();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
        }
    });
});

document.querySelectorAll(".eliminar-producto").forEach(boton => {
    boton.addEventListener("click", async () => {
        const id_producto = boton.getAttribute("data-product-id");

        const confirmar = confirm("¿Seguro que deseas eliminar este producto?");
        if (!confirmar) return;

        try {
            const resp = await fetch(`/api/inventario/${id_producto}`, { method: 'DELETE' });
            const data = await resp.json();
            console.log("Producto eliminado:", data);
            cargarInventario();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    });
});

document.querySelector("#buscador").addEventListener("input", async () => {
    const terminoBusqueda = document.querySelector("#buscador").value.trim().toLowerCase();
    
    if (terminoBusqueda.length === 0) {
        cargarInventario(); 
        return;
    }

    try {
        const response = await fetch('/api/inventario');
        const productos = await response.json();
        
        const resultados = productos.filter(producto =>
            producto.id_producto.toLowerCase().includes(terminoBusqueda) || 
            producto.titulo.toLowerCase().includes(terminoBusqueda)
        );

        mostrarProductos(resultados);
    } catch (error) {
        console.error("Error en la búsqueda:", error);
    }
});

// Función para renderizar los productos filtrados en la tabla
function mostrarProductos(productos) {
    const tabla = document.querySelector("tbody");
    tabla.innerHTML = "";

    productos.forEach(producto => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${producto.id_producto}</td>
            <td>${producto.titulo}</td>
            <td>$${producto.precio}</td>
            <td>${producto.stock}</td>
            <td>Activo</td>
            <td>
                <button class="btn-ico-success editar-producto" data-product-id="${producto.id_producto}"><i class='bx bx-edit'></i></button>
                <button class="btn-ico-danger eliminar-producto" data-product-id="${producto.id_producto}"><i class='bx bx-trash-alt'></i></button>
            </td>
        `;
        tabla.appendChild(tr);
    });

    asignarEventos(); // Asegurar que los botones de editar/eliminar sigan funcionando
}

// para abrir y cerrar el apartado de agregar producto
document.querySelector("#agregar-producto").addEventListener("click", () => {
    document.querySelector("#nuevo-producto").classList.remove("hidden");
});
document.querySelector("#cerrar").addEventListener("click", () => {
    document.querySelector("#nuevo-producto").classList.add("hidden");
});

// para editar productos
// document.addEventListener("click", async (event) => {
//     if (event.target.closest(".editar-producto")) {
//         const boton = event.target.closest(".editar-producto"); // Capturar el botón exacto
//         const id_producto = boton.getAttribute("data-product-id");

//         try {
//             const response = await fetch(`/api/inventario/${id_producto}`);
//             const producto = await response.json();

//             // Mostrar formulario de edición y llenar los datos
//             document.querySelector("#editar-producto").classList.remove("hidden");
//             document.querySelector("#codigoproducto").value = producto.id_producto;
//             document.querySelector("#nombreproducto").value = producto.titulo;
//             document.querySelector("#precioproducto").value = producto.precio;
//             document.querySelector("#stockproducto").value = producto.stock;

//             // Guardar cambios al hacer clic en "Guardar"
//             document.querySelector("#actualizarBtn").addEventListener("click", async () => {
//                 const titulo = document.querySelector("#nombreproducto").value;
//                 const precio = parseFloat(document.querySelector("#precioproducto").value);
//                 const stock = parseInt(document.querySelector("#stockproducto").value);

//                 try {
//                     const resp = await fetch(`/api/inventario/${id_producto}`, {
//                         method: 'PUT',
//                         headers: { "Content-Type": "application/json" },
//                         body: JSON.stringify({ titulo, precio, stock })
//                     });

//                     const data = await resp.json();
//                     console.log("Producto actualizado:", data);
//                     document.querySelector("#editar-producto").classList.add("hidden");
//                     cargarInventario();
//                 } catch (error) {
//                     console.error("Error al actualizar el producto:", error);
//                 }
//             });

//         } catch (error) {
//             console.error("Error al obtener el producto para edición:", error);
//         }
//     }
// });

// document.addEventListener("click", async (event) => {
//     if (event.target.closest(".editar-producto")) {
//         const boton = event.target.closest(".editar-producto"); 
//         const id_producto = boton.getAttribute("data-product-id");

//         try {
//             const response = await fetch(`/api/inventario/${id_producto}`);
//             const producto = await response.json();
//             console.log("Producto obtenido para edición:", producto); // Verificación

//             if (!producto || !producto.id_producto) {
//                 console.error("Error: No se encontraron los datos del producto.");
//                 return;
//             }

//             // Mostrar el formulario y cargar los datos en los inputs
//             document.querySelector("#editar-producto").classList.remove("hidden");
//             document.querySelector("#codigo-producto").value = producto.id_producto;
//             document.querySelector("#nombre-producto").value = producto.titulo;
//             document.querySelector("#precio-producto").value = producto.precio;
//             document.querySelector("#stock-producto").value = producto.stock;
            
//         } catch (error) {
//             console.error("Error al obtener el producto para edición:", error);
//         }
//     }
// });

document.addEventListener("click", async (event) => {
    if (event.target.closest(".editar-producto")) {
        const boton = event.target.closest(".editar-producto"); 
        const id_producto = boton.getAttribute("data-product-id");

        try {
            const response = await fetch(`/api/inventario/${id_producto}`);
            const producto = await response.json();
            console.log("✔ Producto obtenido para edición:", producto);

            if (!producto || !producto.id_producto) {
                console.error("Error: No se encontraron los datos del producto.");
                return;
            }

            // Mostrar el formulario de edición y llenar los inputs con los datos actuales
            document.querySelector("#editar-producto").classList.remove("hidden");
            document.querySelector("#codigo-producto").value = producto.id_producto;
            document.querySelector("#nombre-producto").value = producto.titulo;
            document.querySelector("#precio-producto").value = producto.precio;
            document.querySelector("#stock-producto").value = producto.stock;
            
        } catch (error) {
            console.error("❌ Error al obtener el producto para edición:", error);
        }
    }
});

document.addEventListener("click", async (event) => {
    if (event.target.closest("#actualizarBtn")) { 
        const id_producto = document.querySelector("#codigo-producto").value;
        const titulo = document.querySelector("#nombre-producto").value;
        const precio = parseFloat(document.querySelector("#precio-producto").value);
        const stock = parseInt(document.querySelector("#stock-producto").value);

        if (!id_producto) {
            console.error("Error: id_producto no está definido.");
            return;
        }

        console.log(`✔ Enviando actualización a: /api/inventario/${id_producto}`); 

        try {
            const resp = await fetch(`/api/inventario/${id_producto}`, {
                method: 'PUT',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ titulo, precio, stock })
            });

            const data = await resp.json();
            console.log("✔ Respuesta del servidor:", data);

            if (!resp.ok) {
                throw new Error(data.message || "Error desconocido");
            }

            document.querySelector("#editar-producto").classList.add("hidden");
            cargarInventario();
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            alert("Error al actualizar el producto. Revisa la consola para más detalles.");
        }
    }
});


document.addEventListener("click", async (event) => {
    if (event.target.closest(".eliminar-producto")) {
        const boton = event.target.closest(".eliminar-producto"); 
        const id_producto = boton.getAttribute("data-product-id");

        const confirmar = confirm(`¿Seguro que deseas eliminar el producto ${id_producto}?`);
        if (!confirmar) return;

        try {
            const resp = await fetch(`/api/inventario/${id_producto}`, { method: 'DELETE' });
            const data = await resp.json();
            console.log("✔ Producto eliminado:", data);
            cargarInventario();
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
            alert("Error al eliminar el producto. Revisa la consola para más detalles.");
        }
    }
});


function asignarEventos() {
    document.querySelectorAll(".editar-producto").forEach(boton => {
        boton.addEventListener("click", async (event) => {
            const id_producto = event.target.getAttribute("data-product-id");

            try {
                const response = await fetch(`/api/inventario/${id_producto}`);
                const producto = await response.json();
                console.log("Producto obtenido para edición:", producto);

                // Mostrar el formulario de edición y llenar los datos
                document.querySelector("#editar-producto").classList.remove("hidden");
                document.querySelector("#codigo-producto").value = producto.id_producto;
                document.querySelector("#nombre-producto").value = producto.titulo;
                document.querySelector("#precio-producto").value = producto.precio;
                document.querySelector("#stock-producto").value = producto.stock;
                
            } catch (error) {
                console.error("Error al obtener el producto para edición:", error);
            }
        });
    });
}
