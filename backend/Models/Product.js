const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
    },
    category: {
        type: String,
        required: true,
        // Assuming your manual data uses these categories
        enum: ['Sneaker', 'Boot', 'Sandal', 'Formal', 'Other'], 
    },
    image: {
        type: String, // URL or path to the image
        required: true,
    },
}, { timestamps: true });

// Mongoose will create the 'products' collection in your connected database (auth_db)
const ProductModel = mongoose.model('Product', ProductSchema); 
module.exports = ProductModel;