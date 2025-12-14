// Models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Link to the User model
        required: true,
    },
    userEmail: {
        type: String,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId, // Link to the Product model
        required: true,
    },
    productName: {
        type: String,
        required: true,
    },
    amountPaid: {
        type: Number, // Stored in cents/smallest currency unit
        required: true,
    },
    paymentId: {
        type: String, // Stripe Payment Intent ID
        required: true,
        unique: true,
    },
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Completed',
    }
}, { timestamps: true });

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;