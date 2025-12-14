// Controllers/OrderController.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const OrderModel = require("../Models/Order");
const ProductModel = require("../Models/Product"); // Assuming your path is correct

/**
 * Initiates the payment process by creating a Stripe Payment Intent.
 * Requires user authentication via JWT (req.user must be populated).
 */
const createPaymentIntent = async (req, res) => {
    // Data passed from the frontend
    const { productId, amount } = req.body;

    // Retrieve user data defensively from JWT payload
    // req.user is populated by the ensureAuthenticated middleware
    const userId = req.user._id || req.user.id; 
    const userEmail = req.user.email; 

    // --- CRITICAL DATA VALIDATION ---

    // 1. Check for authenticated User ID
    if (!userId) {
        console.error("Authentication failure: JWT payload missing User ID.");
        return res
            .status(401)
            .json({ success: false, message: "Authentication required or token invalid." });
    }
    
    // 2. Check for required Email (Mandatory for Stripe receipt)
    if (!userEmail || typeof userEmail !== 'string' || userEmail.length < 5) {
        console.error("User email is invalid or missing in token.");
        // We stop here because Stripe requires a valid email.
        return res
            .status(400) 
            .json({ success: false, message: "User profile must have a valid email for checkout." });
    }
    
    // Convert userId to a guaranteed string for metadata
    const userIdString = userId.toString();

    try {
        // 1. Fetch Product Details (to confirm price and stock)
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res
                .status(404)
                .json({ success: false, message: "Product not found." });
        }
        if (product.stock < 1) {
            return res
                .status(400)
                .json({ success: false, message: "Product is out of stock." });
        }
        
        // 2. Create Stripe Payment Intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Stripe expects amount in cents
            currency: "usd",
            // Include user and product ID in metadata for order lookup later
            metadata: {
                userId: userIdString,
                productId: productId.toString(),
            },
            receipt_email: userEmail, 
        });

        // 3. Send client secret back to frontend to render the payment form
        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret, 
            orderInfo: {
                productId: productId,
                productName: product.name,
                amount: amount,
            },
        });
    } catch (error) {
        // Log the detailed error from Stripe/DB to the server console
        console.error("Stripe/DB Error creating payment intent:", error.stack || error); 
        res.status(500).json({ success: false, message: "Payment gateway configuration or processing error." });
    }
};

/**
 * Finalizes the order, reduces stock, and saves the order record after
 * successful payment confirmation from the frontend.
 */
const completeOrder = async (req, res) => {
    const { productId, amount, paymentIntentId } = req.body;
    
    // Assume req.user is populated by ensureAuthenticated
    const userId = req.user._id || req.user.id;
    const userEmail = req.user.email;

    // Convert price to smallest unit (cents) for DB consistency
    const amountInCents = Math.round(amount * 100);

    try {
        // 1. Reduce Stock (Atomic operation)
        const product = await ProductModel.findByIdAndUpdate(
            productId,
            { $inc: { stock: -1 } }, // Decrement stock by 1
            { new: true } // Return the updated document
        );

        if (!product) {
            // Critical failure: Payment succeeded, but product disappeared
            return res
                .status(404)
                .json({
                    success: false,
                    message: "Product not found during order completion. Stock not reduced.",
                });
        }

        // 2. Create Order Record
        const order = new OrderModel({
            userId: userId,
            userEmail: userEmail,
            productId: productId,
            productName: product.name,
            amountPaid: amountInCents,
            paymentId: paymentIntentId,
        });
        await order.save();

        // 3. Success Response
        res
            .status(200)
            .json({
                success: true,
                message: "Order successfully processed",
                newStock: product.stock,
            });
    } catch (error) {
        console.error("Error completing order and saving record:", error.stack || error);
        // Important: If a database error occurs here, the payment may have succeeded,
        // but the stock/order record failed. Manual intervention may be required.
        res
            .status(500)
            .json({ success: false, message: "Order finalization failed due to server error." });
    }
};

const getOrdersByUserId = async (req, res) => {
    // Get the user ID from the JWT payload
    const userId = req.user._id || req.user.id; 

    if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required." });
    }

    try {
        // Find orders matching the userId, sort by newest first (-1)
        const orders = await OrderModel.find({ userId: userId.toString() })
            .sort({ createdAt: -1 });

        res.status(200).json({ 
            success: true, 
            orders: orders 
        });

    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
};

module.exports = {
    createPaymentIntent,
    completeOrder,
    getOrdersByUserId, // 🔥 Export the new function
};