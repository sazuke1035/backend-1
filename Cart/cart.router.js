import express from 'express';
import { readJSON, writeJSON, generateId } from '../utils/utils.js';

const cartsRouter = express.Router();
const CARTS_FILE = 'data/carts.json';


cartsRouter.get('/', async (req, res) => {
    const carts = await readJSON(CARTS_FILE);
    res.json(carts);
});


cartsRouter.get('/:id', async (req, res) => {
    const carts = await readJSON(CARTS_FILE);
    const cart = carts.find(c => c.id === req.params.id);
    cart ? res.json(cart) : res.status(404).json({ error: 'Carrito no encontrado' });
});


cartsRouter.post('/', async (req, res) => {
    const carts = await readJSON(CARTS_FILE);
    const newCart = { id: generateId(), products: [] };
    carts.push(newCart);
    await writeJSON(CARTS_FILE, carts);
    res.status(201).json(newCart);
});


cartsRouter.post('/:id/products', async (req, res) => {
    const { productId } = req.body;
    console.log(`Agregando producto ${productId} al carrito ${req.params.id}`);
    const carts = await readJSON(CARTS_FILE);
    console.log(`Carritos disponibles:`, carts);
    const cart = carts.find(c => c.id === req.params.id.toString());


    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

    cart.products.push({ productId, quantity: 1 }); 
    await writeJSON(CARTS_FILE, carts);
    res.json(cart);
});

export default cartsRouter;
