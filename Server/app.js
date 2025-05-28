import {config} from 'dotenv';
import products from './routes/products.js';
import express from 'express';
import logger from './middleware/logger.js'
import cors from 'cors';

config();

const app = express();

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

export default app;