import express from 'express';
import handlebars from 'express-handlebars';
import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import __dirname from './utils/constantsUtils.js';
import { Server } from 'socket.io';
import websocket from './websocket.js';
import mongoose from 'mongoose';

// Se crea una instancia de express
const app = express();

// Se establece el puerto
const PORT = process.env.PORT || 9090;

// Servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});

// Servidor de sockets
const io = new Server(httpServer);

// Inicializamos el motor de plantillas Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/../views`);
app.set("view engine", "handlebars");

// Establecemos el servidor estático de archivos
// Asegúrate de que esta ruta es correcta respecto a la estructura de tu proyecto
app.use(express.static(`${__dirname}/../../public`));

// Middleware para parsear JSON y URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

// Inicialización de WebSocket
websocket(io);

// Conexión a MongoDB
const uri = "mongodb+srv://jgda:jgda@cluster0.abjsbjo.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri)
    .then(() => console.log('Conectado a MongoDB Atlas'))
    .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));