import Product from '../models/productModel.js'

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find(); // Récupérer tous les produits de la BD
        console.log(products);
        res.status(200).json(products);
    } catch (err) {
        next(err); // Laisser passer à un middlewawe d'erreur
    }
}

export default { getAllProducts };
