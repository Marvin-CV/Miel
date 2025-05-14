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

// Middleware para loging
app.use(morgan('dev'));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(router);

app.listen(PORT, () => {
    console.log("Servidor corriendo en el puerto", PORT);
});