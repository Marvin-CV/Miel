// =======================================================
// Función para cargar el inventario y renderizar la tabla
// =======================================================
async function cargarInventario() {
    try {
      const response = await fetch('/api/inventario');
      const productos = await response.json();
      console.log("✔ Productos cargados:", productos);
  
      const tabla = document.querySelector("#tabla-inventario");
      if (!tabla) {
        console.error("Error: No se encontró el <tbody id='tabla-inventario'>");
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
          <td>
            <button class="btn-ico editar-producto" data-product-id="${producto.id_producto}">
              <i class='bx bx-edit'></i>
            </button>
            <button class="btn-ico-danger eliminar-producto" data-product-id="${producto.id_producto}">
              <i class='bx bx-trash-alt'></i>
            </button>
          </td>
        `;
        tabla.appendChild(tr);
      });
      asignarEventos(); // Si se requiere asignar eventos a botones nuevos
    } catch (error) {
      console.error("Error al cargar el inventario:", error);
    }
  }
  
  document.addEventListener("DOMContentLoaded", cargarInventario);
  
  // =======================================================
  // Agregar nuevo producto (formulario "Nuevo producto")
  // =======================================================
  document.querySelector("#guardarNuevoBtn").addEventListener("click", async () => {
    const id = document.querySelector("#codigoproducto").value.trim();
    const titulo = document.querySelector("#nombreproducto").value.trim();
    const precioStr = document.querySelector("#precioproducto").value.trim();
    const stockStr = document.querySelector("#stockproducto").value.trim();
  
    if (!id || !titulo || !precioStr || !stockStr) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    const precio = parseFloat(precioStr);
    const stock = parseInt(stockStr);
    if (isNaN(precio) || isNaN(stock)) {
      alert("Por favor, ingresa valores numéricos válidos para precio y stock.");
      return;
    }
    try {
      const resp = await fetch('/api/inventario', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, titulo, precio, stock })
      });
      const data = await resp.json();
      console.log("Producto agregado:", data);
      document.querySelector("#nuevo-producto").classList.add("hidden");
      cargarInventario();
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  });
  
  // Abrir y cerrar el formulario de "Nuevo producto"
  document.querySelector("#agregar-producto").addEventListener("click", () => {
    document.querySelector("#nuevo-producto").classList.remove("hidden");
  });
  document.querySelector("#cerrar").addEventListener("click", () => {
    document.querySelector("#nuevo-producto").classList.add("hidden");
  });
  
  // =======================================================
  // Abrir formulario de edición (al hacer clic en el botón "editar")
  // =======================================================
  document.addEventListener("click", async (event) => {
    if (event.target.closest(".editar-producto")) {
      const boton = event.target.closest(".editar-producto");
      const id_producto = boton.getAttribute("data-product-id");
      try {
        const response = await fetch(`/api/inventario/${id_producto}`);
        const producto = await response.json();
        console.log("✔ Producto obtenido para edición:", producto);
        if (!producto || !producto.id_producto) {
          console.error("Error: No se encontraron los datos del producto para edición.");
          return;
        }
        document.querySelector("#editar-producto").classList.remove("hidden");
        document.querySelector("#codigo-producto").value = producto.id_producto;
        document.querySelector("#nombre-producto").value = producto.titulo;
        document.querySelector("#precio-producto").value = producto.precio;
        document.querySelector("#stock-producto").value = producto.stock;
      } catch (error) {
        console.error("Error al obtener el producto para edición:", error);
      }
    }
  });

  document.querySelector("#cancelarEdicionBtn").addEventListener("click", () => {
    document.querySelector("#editar-producto").classList.add("hidden");
  });
  
  // =======================================================
  // Actualizar producto (desde el formulario de edición)
  // =======================================================
  document.addEventListener("click", async (event) => {
    if (event.target.closest("#actualizarBtn")) {
      const id_producto = document.querySelector("#codigo-producto").value;
      const titulo = document.querySelector("#nombre-producto").value;
      const precio = parseFloat(document.querySelector("#precio-producto").value);
      const stock = parseInt(document.querySelector("#stock-producto").value);
      if (!id_producto) {
        console.error("Error: id_producto no está definido en el formulario de edición.");
        return;
      }
      console.log(`✔ Enviando actualización a: /api/inventario/${id_producto}`);
      console.log("✔ Datos a enviar:", JSON.stringify({ titulo, precio, stock }));
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
  
  // =======================================================
  // Eliminar producto desde la tabla (delegation)
  // =======================================================
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
  
  // =======================================================
  // Funcionalidad de búsqueda
  // =======================================================
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
  
  // =======================================================
  // Función para renderizar productos filtrados
  // =======================================================
  function mostrarProductos(productos) {
    const tabla = document.querySelector("#tabla-inventario");
    if (!tabla) {
      console.error("Error: No se encontró el <tbody> con id 'tabla-inventario'.");
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
        <td>
          <button class="btn-ico editar-producto" data-product-id="${producto.id_producto}">
            <i class='bx bx-edit'></i>
          </button>
          <button class="btn-ico-danger eliminar-producto" data-product-id="${producto.id_producto}">
            <i class='bx bx-trash-alt'></i>
          </button>
        </td>
      `;
      tabla.appendChild(tr);
    });
    asignarEventos();
  }
  
  // =======================================================
  // Función para reasignar eventos a botones de edición (opcional si se usan eventos delegados)
  // =======================================================
  function asignarEventos() {
    document.querySelectorAll(".editar-producto").forEach(boton => {
      boton.addEventListener("click", async (event) => {
        const id_producto = boton.getAttribute("data-product-id");
        try {
          const response = await fetch(`/api/inventario/${id_producto}`);
          const producto = await response.json();
          console.log("✔ Producto obtenido para edición (desde asignarEventos):", producto);
          document.querySelector("#editar-producto").classList.remove("hidden");
          document.querySelector("#codigo-producto").value = producto.id_producto;
          document.querySelector("#nombre-producto").value = producto.titulo;
          document.querySelector("#precio-producto").value = producto.precio;
          document.querySelector("#stock-producto").value = producto.stock;
        } catch (error) {
          console.error("Error al obtener el producto para edición (asignarEventos):", error);
        }
      });
    });
  }
  