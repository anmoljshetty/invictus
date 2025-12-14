// Routes/OrderRouter.js (Updated)
const express = require('express');
const router = express.Router();
const ensureAuthenticated = require('../Middlewares/Auth'); 
const { createPaymentIntent, completeOrder, getOrdersByUserId } = require('../Controllers/OrderController'); // 🔥 Added getOrdersByUserId

// Route to initiate payment and get the client secret
router.post('/create-payment-intent', ensureAuthenticated, createPaymentIntent);

// Route to finalize the order after successful payment on the frontend
router.post('/complete-order', ensureAuthenticated, completeOrder);

// 🔥 NEW ROUTE: Fetch all orders for the currently authenticated user
router.get('/my-orders', ensureAuthenticated, getOrdersByUserId); 

module.exports = router;