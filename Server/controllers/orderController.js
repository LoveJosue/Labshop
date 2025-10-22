// import Order from '../models/orderModel.js';

export async function placeOrder(req, res, next) {
    try {
        console.log('Commande effectuée!');
        console.log(req.body);
        res.status(201).json({msg: 'Order Created!'});
    } catch (err) {
        next(err); // Laisser passer à un middlewawe d'erreur
    }
}

