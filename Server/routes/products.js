import express from 'express';
import produits from '../assets/utils.js';

const router = express.Router();

router.get('/', (req, res) => {
    console.log(produits);
    res.status(200).json(produits);
});

router.post('/', (req, res) => {
    const data = req.body;
    console.log(`Object : ${data.name} created.`);
    res.status(201).json({msg: 'Created'});
});

export default router;