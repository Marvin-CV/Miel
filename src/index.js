import express from 'express';
import { PORT } from './config.js';
import router from './assets/routes/index.routes.js';
import morgan from 'morgan';

const app = express();

// Configura Express para servir archivos estáticos
app.use(express.static('src/assets', {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Middleware para logging
app.use(morgan('dev'));

// Middleware para parsear JSON
app.use(express.json());

// Middleware para parsear datos de formularios (urlencoded)
app.use(express.urlencoded({ extended: true }));

// Usar las rutas (esto debe ir después de los middlewares de parseo)
app.use(router);

// Iniciar el servidor
app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto", PORT);
});