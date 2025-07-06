import express from 'express';
import productController from '../controllers/productController.js'

const router = express.Router();


router.get('/', productController.getAllProducts);

router.post('/', (req, res) => {
    const data = req.body;
    console.log(`Object : ${data.name} created.`);
    res.status(201).json({msg: 'Created'});
});

export default router;