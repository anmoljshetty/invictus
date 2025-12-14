const express = require("express")
const app = express()
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const AuthRouter = require('./Routes/AuthRouter');
require('./Models/db')
const productRouter = require('./Routes/ProductRouter');
const orderRouter = require('./Routes/OrderRouter');

const PORT = process.env.PORT || 8080;

if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('"')) {
    console.error("CRITICAL: Stripe key is missing or contains quotes!");
    // You can even exit here if the key is mandatory
}

app.use(bodyParser.json());
app.use(cors());
app.use('/auth',AuthRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);

app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})