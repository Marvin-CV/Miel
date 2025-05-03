// cart.routes.js
import { Router } from "express";
import { 
    getCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    checkoutCart
} from "../controllers/cart.controller.js";

const router = Router();

// Ruta para obtener los ítems del carrito
router.get("/", getCartItems);

// Ruta para agregar un producto al carrito
router.post("/add", addToCart);

// Ruta para eliminar un producto del carrito (se recibe el productId en los parámetros)
router.delete("/delete/:productId", removeFromCart);

// Ruta para vaciar el carrito completo
router.delete("/clear", clearCart);

// Ruta para procesar la compra (checkout)
router.post("/checkout", checkoutCart);

export default router;
