import pool from '../models/conectbd.js';

// Función para obtener la información del usuario logueado
export const obtenerUsuario = async (req, res) => {
    try {
        const userId = req.user ? req.user.userId : null;
        const [user] = await pool.query('SELECT nombre, email FROM usuarios WHERE id = ?', [userId]);

        if (user.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(user[0]);
    } catch (error) {
        console.error('Error obteniendo información del usuario:', error);
        res.status(500).json({ error: 'Error obteniendo información del usuario' });
    }
};

// Función para actualizar la información del usuario
export const actualizarUsuario = async (req, res) => {
    const { nombre, email } = req.body;

    try {
        const userId = req.userId;

        // Actualizar la información del usuario en la base de datos
        const query = 'UPDATE usuarios SET nombre = ?, email = ? WHERE id = ?';
        const values = [nombre, email, userId];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Usuario actualizado correctamente' });
        } else {
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        }
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        res.status(500).json({ error: 'Error actualizando usuario' });
    }
};

// Función para eliminar el usuario logueado
export const eliminarUsuario = async (req, res) => {
    try {
        const userId = req.userId;

        // Eliminar el usuario de la base de datos
        const query = 'DELETE FROM usuarios WHERE id = ?';
        const values = [userId];

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 1) {
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        }
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        res.status(500).json({ error: 'Error eliminando usuario' });
    }
};