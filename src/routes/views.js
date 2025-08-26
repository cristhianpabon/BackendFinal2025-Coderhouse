import { Router } from 'express';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

const router = Router();

router.get('/products', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const products = await Product.find().skip(skip).limit(limit).lean();
        const totalDocs = await Product.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        res.render('products', {
            products,
            pagination: {
                page,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.get('/products/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.render('product-detail', { product });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.get('/carts/:cid', async (req, res) => {
    try {
        const cart = await Cart.findById(req.params.cid).populate('products.product');

        if (!cart) {
            return res.status(404).json({
                status: 'error',
                message: 'Carrito no encontrado'
            });
        }

        let totalItems = 0;
        let totalPrice = 0;

        const productsWithSubtotal = cart.products.map(item => {
            const subtotal = item.product.price * item.quantity;
            totalItems += item.quantity;
            totalPrice += subtotal;
            return {
                ...item,
                subtotal: subtotal.toFixed(2)
            };
        });

        res.render('cart', {
            cart: {
                ...cart,
                products: productsWithSubtotal
            },
            totalItems,
            totalPrice: totalPrice.toFixed(2)
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.get('/', (req, res) => {
    res.redirect('/products');
});

export default router;