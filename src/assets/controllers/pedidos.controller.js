import pool from '../models/conectbd.js'; // Ajusta la ruta según tu estructura


export const getPedidosPendientes = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM historial_pedidos WHERE estado = 'pendiente'");
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener pedidos pendientes:", error);
    res.status(500).json({ message: "Error al obtener pedidos pendientes" });
  }
};


export const getPedidosEntregados = async (req, res) => {
    try {
      let querySQL = "SELECT * FROM historial_pedidos WHERE estado = 'entregado'";
      const params = [];
      if (req.query.search) {
        querySQL += " AND (LOWER(id_pedido) LIKE ? OR LOWER(nombre_cliente) LIKE ?)";
        const searchTerm = "%" + req.query.search.toLowerCase() + "%";
        params.push(searchTerm, searchTerm);
      }
      const [rows] = await pool.query(querySQL, params);
      res.json(rows);
    } catch (error) {
      console.error("Error al obtener pedidos entregados:", error);
      res.status(500).json({ message: "Error al obtener pedidos entregados" });
    }
};
  
  
export const entregarPedido = async (req, res) => {
  const { id_pedido } = req.params;
  try {
    const [result] = await pool.query(
      "UPDATE historial_pedidos SET estado = 'entregado' WHERE id_pedido = ?",
      [id_pedido]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Pedido no encontrado" });
    }
    res.json({ message: "Pedido actualizado a entregado correctamente" });
  } catch (error) {
    console.error("Error al actualizar pedido:", error);
    res.status(500).json({ message: "Error al actualizar pedido" });
  }
};
