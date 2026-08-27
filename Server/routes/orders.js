import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

// Historique des commandes du client connecté
router.get('/', requireAuth, orderController.getMyOrders);

export default router;
