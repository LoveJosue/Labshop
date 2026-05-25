import dotenv from 'dotenv';
dotenv.config(); // doit précéder l'import des contrôleurs

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';

import products from './routes/products.js';
import order from './routes/order.js';
import auth from './routes/auth.js';
import logger from './middleware/logger.js';
import connectDB from './db.js';

const port = process.env.PORT || 3000;
const app = express();

// Connexion à MongoDB
connectDB();

// CORS — origine précise + credentials pour que le cookie httpOnly voyage
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Logger middleware
app.use(logger);

// Routes
app.use('/api/products', products);
app.use('/api/order',    order);
app.use('/api/auth',     auth);

// Middleware d'erreur global
app.use((err, req, res, next) => {
    console.error('Erreur :', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

// Fermeture propre de MongoDB à l'arrêt
process.on('SIGINT', async () => {
    console.log('\n🛑 Fermeture du serveur...');
    await mongoose.connection.close();
    console.log('Connexion MongoDB fermée');
    process.exit(0);
});

app.listen(port, () => {
    console.log(`App running on port ${port} ...`);
});

export default app;