import express from 'express';
import cartsRouter from './Cart/cart.router.js';
import productsRouter from './Product/product.router.js';

const app = express();
const PORT = 8080;
app.use(express.json());


app.use('/api/carts', cartsRouter);
app.use('/api/products', productsRouter);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
