// Controllers/ProductController.js
const ProductModel = require('../Models/Product');

// Controller function to fetch all products (Publicly accessible)
const getAllProducts = async (req, res) => {
    try {
        // Find all documents in the 'products' collection
        const products = await ProductModel.find({}); 
        console.log("Products found in DB:", products.length);
        
        res.status(200).json({
            success: true,
            products: products // Sends an array of product objects
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            message: 'Internal Server Error while fetching products',
            success: false
        });
    }
};


module.exports = {
    getAllProducts
};