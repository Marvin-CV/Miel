import pool from '../models/conectbd.js';

// Función para obtener productos
export const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM productos');
        res.json(rows);  // Envía los productos como JSON
    } catch (error) {
        console.error('Error obteniendo productos:', error);
        res.status(500).json({ error: 'Error obteniendo productos' });
    }
};
