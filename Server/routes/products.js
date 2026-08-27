import express from 'express';
import * as productController from '../controllers/productController.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Lecture publique du catalogue
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

// Création réservée aux administrateurs
router.post('/', requireAuth, requireAdmin, (req, res) => {
    const data = req.body;
    console.log(`Object : ${data.name} created.`);
    res.status(201).json({msg: 'Created'});
});

export default router;