import {config} from 'dotenv';
import products from './routes/products.js';
import express from 'express';
import logger from './middleware/logger.js'
import cors from 'cors';
import connectDB from './config/db.js';

const port = process.env.PORT || 3000;

config();

const app = express();

// Connexion à MongoDB
// connectDB();

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

// Routes
app.use('/api/products', products);

app.listen(port, () => {
    console.log(`App running on port ${port} ...`)
})

export default app;