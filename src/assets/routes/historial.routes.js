import express from 'express';
import { 
  getPedidosPendientes, 
  getPedidosEntregados, 
  entregarPedido 
} from '../controllers/pedidos.controller.js';

const router = express.Router();

router.get('/pendientes', getPedidosPendientes);
router.get('/entregados', getPedidosEntregados);
router.put('/:id_pedido/entregar', entregarPedido);

export default router;
