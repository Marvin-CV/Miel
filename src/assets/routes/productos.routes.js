import express from 'express';
import { 
  getProductos, 
  getProductoById, 
  createProducto, 
  updateProducto, 
  deleteProducto,
  getStockProducto
} from '../controllers/productos.controller.js';

const router = express.Router();

router.get('/', getProductos);
router.get('/:id_producto', getProductoById);
router.post('/', createProducto);
router.put('/:id_producto', updateProducto);
router.delete('/:id_producto', deleteProducto);
router.get('/:id_producto/stock', getStockProducto);

export default router;
