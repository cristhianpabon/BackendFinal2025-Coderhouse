import { Router } from 'express';
import Cart from '../models/Cart.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const cart = new Cart({ products: [] });
        await cart.save();

        res.status(201).json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity = 1 } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        const existingProductIndex = cart.products.findIndex(
            item => item.product.toString() === pid
        );

        if (existingProductIndex > -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: pid, quantity });
        }

        await cart.save();
        await cart.populate('products.product');

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        cart.products = cart.products.filter(
            item => item.product.toString() !== pid
        );

        await cart.save();
        await cart.populate('products.product');

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.put('/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        const { products } = req.body;

        const cart = await Cart.findByIdAndUpdate(
            cid,
            { products },
            { new: true }
        ).populate('products.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const { quantity } = req.body;

        const cart = await Cart.findById(cid);
        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        const productIndex = cart.products.findIndex(
            item => item.product.toString() === pid
        );

        if (productIndex === -1) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado en el carrito'
            });
        }

        cart.products[productIndex].quantity = quantity;
        await cart.save();
        await cart.populate('products.product');

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await Cart.findByIdAndUpdate(
            req.params.cid,
            { products: [] },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: cart
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

export default router;