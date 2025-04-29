import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cartsRouter from './Cart/cart.router.js';
import productsRouter from './Product/product.router.js';
import exphbs from 'express-handlebars';
import { setSocketIO } from './Product/product.router.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 8080;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.engine('handlebars', exphbs.engine({
    layoutsDir: './views/layouts/'
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = createServer(app);
const io = new Server(server);

app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.get('/realtimeproducts', (req, res) => {
    res.render('layouts/realTimeProducts', { title: 'Productos en Tiempo Real' });
});

app.get('/home', (req, res) => {
    const products = getProducts();
    res.render('layouts/home', { title: 'Lista de Productos', products });
});

app.post('/api/products', (req, res) => {
    const newProduct = req.body;
    const products = getProducts();
    products.push(newProduct);
    saveProducts(products);
    res.json(newProduct);
});

app.delete('/api/products/:name', (req, res) => {
    const productName = req.params.name;
    let products = getProducts();
    products = products.filter(product => product.name !== productName);
    saveProducts(products);
    res.json({ message: 'Producto eliminado' });
});

function getProducts() {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'products.json'));
    return JSON.parse(data);
}

function saveProducts(products) {
    fs.writeFileSync(path.join(__dirname, 'data', 'products.json'), JSON.stringify(products, null, 2));
}

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('newProduct', (product) => {
        io.emit('updateProducts', product);
    });

    socket.on('deleteProduct', (productId) => {
        io.emit('removeProduct', productId);
    });
});

setSocketIO(io);

server.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
