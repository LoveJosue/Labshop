import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// optionalAuth : commande possible en invité, mais rattachée au compte si connecté
router.post('/', optionalAuth, orderController.placeOrder);
router.get('/:orderNumber', orderController.getOrderByNumber);

export default router;