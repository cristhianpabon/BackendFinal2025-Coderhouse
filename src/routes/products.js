import { Router } from 'express';
import Product from '../models/Product.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;

        const products = await Product.find().skip(skip).limit(limit);
        const totalDocs = await Product.countDocuments();
        const totalPages = Math.ceil(totalDocs / limit);

        res.json({
            status: 'success',
            payload: products,
            totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null,
            page,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const product = await Product.findById(req.params.pid);
        
        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();

        res.status(201).json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.pid,
            req.body,
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'success',
            payload: product
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

router.delete('/:pid', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.pid);

        if (!product) {
            return res.status(404).json({
                status: 'error',
                message: 'Producto no encontrado'
            });
        }

        res.json({
            status: 'success',
            message: 'Producto eliminado'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error interno del servidor'
        });
    }
});

export default router;