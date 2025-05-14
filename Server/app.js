import {config} from 'dotenv';
import express from 'express';
config();
const port = process.env.PORT || 3000;

const app = express();
app.get('/', (req, res) => {
    res.send('Hello World');
})
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
