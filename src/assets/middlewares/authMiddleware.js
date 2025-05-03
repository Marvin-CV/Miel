// import jwt from 'jsonwebtoken';

// export const verificarToken = (req, res, next) => {
//     // Obtener el token del header de la solicitud
//     const token = req.header('Authorization')?.replace('Bearer ', '');

//     if (!token) {
//         return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
//     }

//     try {
//         // Verificar el token
//         const decoded = jwt.verify(token, 'tu_clave_secreta');
//         req.userId = decoded.userId; // Almacenar el ID del usuario en la solicitud
//         next(); // Continuar con la siguiente función
//     } catch (error) {
//         console.error('Error verificando token:', error);
//         res.status(400).json({ error: 'Token inválido o expirado.' });
//     }
// };

import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
    // Obtener el token del header de la solicitud
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado.' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, 'tu_clave_secreta');
        // Asignamos el objeto completo decodificado a req.user
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error verificando token:', error);
        res.status(400).json({ error: 'Token inválido o expirado.' });
    }
};
