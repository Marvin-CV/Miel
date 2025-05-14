import { Router } from 'express';
import { getProducts } from '../controllers/index.controller.js';
import { registrarUsuario, autenticarUsuario } from '../controllers/login.controller.js';
import { obtenerUsuario, actualizarUsuario, eliminarUsuario } from '../controllers/users.controller.js';
import productosRoutes from '../routes/productos.routes.js';
import historialRoutes from '../routes/historial.routes.js';
import { verificarToken } from '../middlewares/authMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cartRoutes from '../routes/cart.routes.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Rutas de API y otros endpoints

// Ruta para obtener productos
router.get('/api/productos', getProducts);

// Rutas para usuarios
router.post('/api/registrar', registrarUsuario);
router.post('/api/login', autenticarUsuario);
router.get('/api/usuario', verificarToken, obtenerUsuario);
router.put('/api/usuario', verificarToken, actualizarUsuario);
router.delete('/api/usuario', verificarToken, eliminarUsuario);

// Ruta para el carrito
router.use('/api/cart', cartRoutes);

// Montamos las rutas de productos (inventario)  
router.use('/api/inventario', productosRoutes);
// para pedidos
router.use('/api/historial', historialRoutes);

// Rutas para servir vistas HTML
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'));
});
router.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/inicio.html'));
});
router.get('/catalogo', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/catalogo.html'));
});
router.get('/carrito', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/carrito.html'));
});
router.get('/inventario', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/inventario.html'));
});
router.get('/pedidos', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pedidos.html'));
});
router.get('/users', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/users.html'));
});

export default router;
