import jwt from 'jsonwebtoken'; // Importar JWT
import pool from '../models/conectbd.js';

export const autenticarUsuario = async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        // Verificar si el usuario existe
        const [user] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (user.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Verificar la contraseña (en texto plano)
        if (contraseña !== user[0].contraseña) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Crear un token JWT
        const token = jwt.sign(
            { userId: user[0].id }, // Payload: información que quieres almacenar en el token
            'tu_clave_secreta', // Clave secreta para firmar el token (cámbiala por una clave segura)
            { expiresIn: '1h' } // Tiempo de expiración del token
        );

        // Devolver el token y la información del usuario
        res.status(200).json({
            success: true,
            token, // Envía el token al frontend
            redirectTo: '/inicio' // Ruta de redirección
        });
    } catch (error) {
        console.error('Error autenticando usuario:', error);
        res.status(500).json({ error: 'Error autenticando usuario' });
    }
};

// Función para registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    try {
        // Verificar si el usuario ya existe
        const [existingUser] = await pool.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
        }

        // Insertar el nuevo usuario en la base de datos (sin hashear la contraseña)
        const query = 'INSERT INTO usuarios (nombre, email, contraseña) VALUES (?, ?, ?)';
        const values = [nombre, email, contraseña]; // Almacenar la contraseña en texto plano

        const [result] = await pool.query(query, values);

        if (result.affectedRows === 1) {
            res.status(201).json({ message: 'Usuario registrado correctamente' });
        } else {
            res.status(500).json({ error: 'Error al registrar el usuario' });
        }
    } catch (error) {
        console.error('Error registrando usuario:', error);
        res.status(500).json({ error: 'Error registrando usuario' });
    }
};