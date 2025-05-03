
// Cargar pedidos pendientes
async function cargarPedidosPendientes() {
    try {
      const resp = await fetch('/api/historial/pendientes');
      const pedidos = await resp.json();
      const tbody = document.querySelector("#tabla-pendientes");
      tbody.innerHTML = "";
      pedidos.forEach(pedido => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${pedido.id_pedido}</td>
          <td>${pedido.nombre_cliente}</td>
          <td>${pedido.productos}</td>
          <td>${pedido.total}</td>
          <td>${pedido.fecha}</td>
          <td>
            <button class="btn-entregar btn-secundary" data-id="${pedido.id_pedido}"><i class='bx bx-check-double' ></i> Completar</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar pedidos pendientes:", error);
    }
  }
  
  function mostrarPedidosEntregados(pedidos) {
    const tbody = document.querySelector("#tabla-entregados");
    tbody.innerHTML = "";
    pedidos.forEach(pedido => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${pedido.id_pedido}</td>
        <td>${pedido.nombre_cliente}</td>
        <td>${pedido.productos}</td>
        <td>${pedido.total}</td>
        <td>${pedido.fecha}</td>
        <td>Completado</td>
      `;
      tbody.appendChild(tr);
    });
  }
  

  // Cargar pedidos entregados
  async function cargarPedidosEntregados() {
    try {
      const resp = await fetch('/api/historial/entregados');
      const pedidos = await resp.json();
      const tbody = document.querySelector("#tabla-entregados");
      tbody.innerHTML = "";
      pedidos.forEach(pedido => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${pedido.id_pedido}</td>
          <td>${pedido.nombre_cliente}</td>
          <td>${pedido.productos}</td>
          <td>${pedido.total}</td>
          <td>${pedido.fecha}</td>
          <td>Completado</td>
        `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al cargar pedidos entregados:", error);
    }
  }
  
  // Recargar ambas tablas
  async function cargarHistorialPedidos() {
    await cargarPedidosPendientes();
    await cargarPedidosEntregados();
  }
  
  document.addEventListener("DOMContentLoaded", cargarHistorialPedidos);
  
  // Actualizar estado a entregado al hacer clic en el botón
  document.addEventListener("click", async (event) => {
    if (event.target.closest(".btn-entregar")) {
      const btn = event.target.closest(".btn-entregar");
      const id_pedido = btn.getAttribute("data-id");
      const confirmar = confirm("¿Desea marcar este pedido como entregado?");
      if (!confirmar) return;
      try {
        const resp = await fetch(`/api/historial/${id_pedido}/entregar`, {
          method: 'PUT'
        });
        const data = await resp.json();
        console.log("Pedido actualizado:", data);
        cargarHistorialPedidos();
      } catch (error) {
        console.error("Error al actualizar el estado del pedido:", error);
      }
    }
  });

//aca andamos

document.querySelector("#buscar-pedido").addEventListener("input", async () => {
    const terminoBusqueda = document.querySelector("#buscar-pedido").value.trim();
    try {
      const response = await fetch('/api/historial/entregados?search=' + encodeURIComponent(terminoBusqueda));
      const pedidos = await response.json();
      mostrarPedidosEntregados(pedidos);
    } catch (error) {
      console.error("Error en la búsqueda:", error);
    }
  });
  
  
