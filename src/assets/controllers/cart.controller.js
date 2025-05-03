// cart.controllers.js
import pool from '../models/conectbd.js';

// Obtener los ítems del carrito para el usuario (user_id fijo = 1 en este ejemplo)
export const getCartItems = async (req, res) => {
    const userId = 1; // En producción, sustituye por el ID real del usuario
    try {
        const [rows] = await pool.query(
            `SELECT ci.product_id, ci.quantity, p.titulo, p.imagen, p.precio, p.stock 
             FROM cart_items ci 
             JOIN productos p ON ci.product_id = p.id_producto 
             WHERE ci.user_id = ?`,
            [userId]
        );
        res.json(rows);
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        res.status(500).json({ message: "Error al obtener el carrito." });
    }
};

// Agregar un producto al carrito
export const addToCart = async (req, res) => {
    const userId = 1; // Reemplazar en producción
    const { productId, quantity } = req.body;
    try {
        // Verificar si el producto ya existe en el carrito para ese usuario
        const [existing] = await pool.query(
            `SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );

        if (existing.length > 0) {
            // Si ya existe, actualizar la cantidad
            const newQuantity = existing[0].quantity + quantity;
            await pool.query(
                `UPDATE cart_items SET quantity = ? WHERE id = ?`,
                [newQuantity, existing[0].id]
            );
        } else {
            // De lo contrario, insertar el nuevo registro
            await pool.query(
                `INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)`,
                [userId, productId, quantity]
            );
        }
        res.status(201).json({ message: "Producto añadido al carrito." });
    } catch (error) {
        console.error("Error al añadir producto al carrito:", error);
        res.status(500).json({ message: "Error al añadir el producto al carrito." });
    }
};

// Eliminar un producto del carrito
export const removeFromCart = async (req, res) => {
    const userId = 1; // Reemplazar según la sesión
    const { productId } = req.params;
    try {
        await pool.query(
            `DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`,
            [userId, productId]
        );
        res.json({ message: "Producto eliminado del carrito." });
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error);
        res.status(500).json({ message: "Error al eliminar el producto del carrito." });
    }
};

// Vaciar el carrito completo para el usuario
export const clearCart = async (req, res) => {
    const userId = 1; // Reemplazar según la autenticación
    try {
        await pool.query(
            `DELETE FROM cart_items WHERE user_id = ?`,
            [userId]
        );
        res.json({ message: "Carrito vaciado correctamente." });
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).json({ message: "Error al vaciar el carrito." });
    }
};

// Checkout: procesa la compra y disminuye el stock de cada producto
export const checkoutCart = async (req, res) => {
    const { cartItems, total } = req.body;
    const id_usuario = req.user ? (req.user.id || req.user.userId) : 1;
    // Asumiendo que ya tienes el nombre del cliente en req.user o por defecto
    const cliente = req.user && req.user.nombre ? req.user.nombre : "Cliente Test";
    
    // Para el campo de productos, solo mostramos título y cantidad:
    const productosDetalle = cartItems
      .map(item => `${item.titulo} (${item.quantity})`)
      .join(', ');
  
    let connection;
    try {
      connection = await pool.getConnection();
      await connection.beginTransaction();
  
      // Actualizar stock de cada producto
      for (const item of cartItems) {
        const [rows] = await connection.query(
          "SELECT stock FROM productos WHERE id_producto = ? FOR UPDATE",
          [item.product_id]
        );
        if (rows.length === 0) {
          throw new Error(`Producto con id ${item.product_id} no encontrado`);
        }
        const currentStock = rows[0].stock;
        if (currentStock < item.quantity) {
          throw new Error(`No hay stock suficiente para el producto ${item.product_id}`);
        }
        await connection.query(
          "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
          [item.quantity, item.product_id]
        );
      }
      
      // Insertar el pedido en historial_pedidos
      await connection.query(
        "INSERT INTO historial_pedidos (id_cliente, nombre_cliente, productos, total, estado, fecha) VALUES (?, ?, ?, ?, 'pendiente', NOW())",
        [id_usuario, cliente, productosDetalle, total]
      );
      
      // Eliminar los ítems del carrito para ese usuario
      await connection.query(
        "DELETE FROM cart_items WHERE user_id = ?",
        [id_usuario]
      );
      
      await connection.commit();
      res.json({ message: "Compra realizada con éxito" });
    } catch (error) {
      if (connection) await connection.rollback();
      console.error("Error al procesar la compra:", error);
      res.status(500).json({ message: "Error al procesar la compra", error: error.message });
    } finally {
      if (connection) connection.release();
    }
  };
  

// export const checkoutCart = async (req, res) => {
//     const { cartItems, total } = req.body;
    
//     // Ajustando el cliente, usando un valor predeterminado si no existe en el token
//     const id_usuario = req.user ? (req.user.id || req.user.userId) : 1;
//     const cliente = req.user && req.user.nombre ? req.user.nombre : "Cliente Test";
    
//     // Transformar los datos del carrito para almacenar solo título y cantidad
//     const productosDetalle = cartItems
//       .map(item => `${item.titulo} (${item.quantity})`)
//       .join(', ');
    
//     let connection;
//     try {
//       connection = await pool.getConnection();
//       await connection.beginTransaction();
    
//       // Procesar cada producto para actualizar stock
//       for (const item of cartItems) {
//         const [rows] = await connection.query(
//           "SELECT stock FROM productos WHERE id_producto = ? FOR UPDATE",
//           [item.product_id]
//         );
//         if (rows.length === 0) {
//           throw new Error(`Producto con id ${item.product_id} no encontrado`);
//         }
//         const currentStock = rows[0].stock;
//         if (currentStock < item.quantity) {
//           throw new Error(`No hay stock suficiente para el producto ${item.product_id}`);
//         }
//         await connection.query(
//           "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
//           [item.quantity, item.product_id]
//         );
//       }
    
//       // Insertar en la tabla de historial de pedidos (ahora con la columna nombre_cliente)
//       await connection.query(
//         "INSERT INTO historial_pedidos (id_cliente, nombre_cliente, productos, total, estado, fecha) VALUES (?, ?, ?, ?, 'pendiente', NOW())",
//         [id_usuario, cliente, productosDetalle, total]
//       );
    
//       await connection.commit();
//       res.json({ message: "Compra realizada con éxito" });
//     } catch (error) {
//       if (connection) await connection.rollback();
//       console.error("Error al procesar la compra:", error);
//       res.status(500).json({ message: "Error al procesar la compra", error: error.message });
//     } finally {
//       if (connection) connection.release();
//     }
//   };
  

// export const checkoutCart = async (req, res) => {
//     const { cartItems, total } = req.body;
//     const id_usuario = req.user ? (req.user.id || req.user.userId) : 1;
//     const cliente = req.user ? (req.user.nombre || "Cliente Test") : "Cliente Test";
  
//     // Usa JSON.stringify para almacenar detalle del pedido
//     const productosDetalle = JSON.stringify(cartItems);
  
//     let connection;
//     try {
//       connection = await pool.getConnection();
//       await connection.beginTransaction();
  
//       // Recorremos cada producto para actualizar stock
//       for (const item of cartItems) {
//         // Usamos item.product_id en lugar de item.id
//         const [rows] = await connection.query(
//           "SELECT stock FROM productos WHERE id_producto = ? FOR UPDATE",
//           [item.product_id]
//         );
//         if (rows.length === 0) {
//           throw new Error(`Producto con id ${item.product_id} no encontrado`);
//         }
//         const currentStock = rows[0].stock;
//         if (currentStock < item.quantity) {
//           throw new Error(`No hay stock suficiente para el producto ${item.product_id}`);
//         }
//         // Actualizamos el stock utilizando item.product_id
//         await connection.query(
//           "UPDATE productos SET stock = stock - ? WHERE id_producto = ?",
//           [item.quantity, item.product_id]
//         );
//       }
      
//       // Inserción en la tabla de historial de pedidos (estado pendiente)
//       await connection.query(
//         "INSERT INTO historial_pedidos (id_cliente, nombre_cliente, productos, total, estado, fecha) VALUES (?, ?, ?, ?, 'pendiente', NOW())",
//         [id_usuario, cliente, productosDetalle, total]
//       );
      
  
//       await connection.commit();
//       res.json({ message: "Compra realizada con éxito" });
//     } catch (error) {
//       if (connection) await connection.rollback();
//       console.error("Error al procesar la compra:", error);
//       res.status(500).json({ message: "Error al procesar la compra", error: error.message });
//     } finally {
//       if (connection) connection.release();
//     }
//   };
