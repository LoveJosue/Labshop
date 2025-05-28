import {config} from 'dotenv';
import products from './routes/products.js';
import express from 'express';
import logger from './middleware/logger.js'
import cors from 'cors';
import { createServer } from '@vercel/node';
config();
const port = process.env.PORT || 3000;

const app = express();

// Autorisation des requettes venant du front-end
app.use(cors({
    origin: 'http://localhost:5173'
}))

// Temporairement (autoriser tous les clients)
// app.use(cors());


app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Routes
app.use('/api/products', products);

// Logger middleware
app.use(logger);



app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export default createServer(app);