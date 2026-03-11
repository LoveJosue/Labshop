import dotenv from 'dotenv';
import products from './routes/products.js';
import order from './routes/order.js';
import express from 'express';
import logger from './middleware/logger.js'
import language from './middleware/language.js';
import cors from 'cors';
import connectDB from './db.js';
import mongoose from 'mongoose';

const port = process.env.PORT || 3000;

dotenv.config();

const app = express();

// Connexion à MongoDB
connectDB();

// Restrictions d'accès à l'API
// app.use(cors({
//     origin: 'http://localhost:5173'
// }))

// Autoriser tous les domaines. Restreindre plus tard
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Logger middleware
app.use(logger);
app.use(language);

// Routes
app.use('/api/products', products);
app.use('/api/order', order);

// Middleware d'erreur global
app.use((err, req, res, next) => {
    console.error('Erreur :', err.message);
    res.status(500).json({ error: 'Erreur interne du serveur' });
})

// Fermerture propre de MongoDB à l'arrêt
process.on('SIGINT', async () => {
    console.log('\n🛑 Fermeture du serveur...');
    await mongoose.connection.close();
    console.log('Connexion MongoDB fermée');
    process.exit(0);
})
app.listen(port, () => {
    console.log(`App running on port ${port} ...`)
})

export default app;