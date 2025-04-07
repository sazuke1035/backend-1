import express from 'express';
import { readJSON, writeJSON, generateId } from '../utils/utils.js';

const productsRouter = express.Router();
const PRODUCTS_FILE = 'data/products.json';

productsRouter.get('/', async (req, res) => {
    try {
        const products = await readJSON(PRODUCTS_FILE);
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});


productsRouter.get('/:id', async (req, res) => {
    try {
        const products = await readJSON(PRODUCTS_FILE);
        const product = products.find(p => p.id === req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el producto' });
    }
});

productsRouter.post('/', async (req, res) => {
    try {
        const products = await readJSON(PRODUCTS_FILE);
        const newProduct = {
            id: generateId(),
            ...req.body
        };
        products.push(newProduct);
        await writeJSON(PRODUCTS_FILE, products);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el producto' });
    }
});

productsRouter.put('/:id', async (req, res) => {
    try {
        const products = await readJSON(PRODUCTS_FILE);
        const index = products.findIndex(p => p.id === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        products[index] = { ...products[index], ...req.body };
        await writeJSON(PRODUCTS_FILE, products);
        res.json(products[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});


productsRouter.delete('/:id', async (req, res) => {
    try {
        const products = await readJSON(PRODUCTS_FILE);
        const filteredProducts = products.filter(p => p.id !== req.params.id);
        if (filteredProducts.length === products.length) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        await writeJSON(PRODUCTS_FILE, filteredProducts);
        res.json({ message: 'Producto eliminado' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

export default productsRouter;