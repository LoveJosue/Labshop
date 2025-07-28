import Product from '../models/productModel.js'

export async function getAllProducts (req, res, next) {
    try {
        const products = await Product.find(); // Récupérer tous les produits de la BD
        res.status(200).json(products);
    } catch (err) {
        next(err); // Laisser passer à un middlewawe d'erreur
    }
}

export async function getProduct (req, res, next) {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        res.status(200).json(product);

    } catch (err) {
        next(err);
    }
}
