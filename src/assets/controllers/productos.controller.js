import pool from '../models/conectbd.js';

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json(rows);
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ error: 'Error obteniendo productos' });
  }
};

// Obtener un producto por ID (usando id_producto)
export const getProductoById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE id_producto = ?',
      [req.params.id_producto]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({ message: 'Error al obtener producto' });
  }
};

// Crear un nuevo producto 
export const createProducto = async (req, res) => {
  const { id, titulo, imagen, precio, stock } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO productos (id_producto, titulo, imagen, precio, stock) VALUES (?, ?, ?, ?, ?)',
      [id, titulo, imagen, precio, stock]
    );
    res.status(201).json({
      id,
      titulo,
      imagen,
      precio,
      stock,
      insertId: result.insertId
    });
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ message: 'Error al crear producto' });
  }
};

// Actualizar un producto
export const updateProducto = async (req, res) => {
  const { titulo, imagen, precio, stock } = req.body;
  const { id_producto } = req.params; 
  try {
    const [result] = await pool.query(
      'UPDATE productos SET titulo = ?, imagen = ?, precio = ?, stock = ? WHERE id_producto = ?',
      [titulo, imagen, precio, stock, id_producto]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ id_producto, titulo, imagen, precio, stock });
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).json({ message: 'Error al actualizar producto.' });
  }
};

// Eliminar un producto
export const deleteProducto = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const [result] = await pool.query(
      'DELETE FROM productos WHERE id_producto = ?',
      [id_producto]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).json({ message: 'Error al eliminar producto' });
  }
};

// Obtener stock de un producto
export const getStockProducto = async (req, res) => {
  const { id_producto } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT stock FROM productos WHERE id_producto = ?',
      [id_producto]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json({ stock: rows[0].stock });
  } catch (error) {
    console.error('Error al obtener stock del producto:', error);
    res.status(500).json({ message: 'Error al obtener stock del producto' });
  }
};
