// pages/ProductList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils'; 
import './ProductList.css'; // Import the dedicated CSS

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
    // BACKEND ENDPOINT: Using the configured route
    const url = 'http://localhost:8080/api/products'; 

    const fetchProducts = async () => {
        const token = localStorage.getItem('token'); 
        
        if (!token) {
            handleError("Session expired or token missing. Please log in.");
            navigate('/login'); 
            return;
        }
        
        try {
            const headers = {
                headers: {
                    'Authorization': `${token}` 
                }
            };

            const response = await fetch(url, headers);
            const result = await response.json();

            if (response.ok) { // Status 200-299: Success
                setProducts(result.products); 
            } else if (response.status === 403) { 
                handleError(result.message || 'Access denied. Please log in again.');
                localStorage.removeItem('token'); 
                navigate('/login');
            } else {
                handleError(result.message || 'Failed to fetch products due to server error.');
            }
        } catch (error) {
            handleError('Network error: Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };
    
    // Handler for the Buy Now button
    const handleBuyNow = (product) => {
        console.log("Navigating to checkout with product:", product);
        // Navigate to checkout page, passing the product data in state
        navigate('/checkout', { state: { product: product } });
    };

    // Handler for the My Orders link
    const handleViewOrders = () => {
        navigate('/my-orders');
    }

    useEffect(() => {
        fetchProducts();
    }, []); // Run only once on mount

    // --- RENDER LOGIC ---

    if (loading) {
        return <div className="product-list-message">Loading amazing shoes...</div>;
    }

    if (products.length === 0) {
        return <div className="product-list-message">No products found. Time to stock the shelves!</div>;
    }

    return (
        <div className="product-list-container">
            {/* Header containing title and the new Orders button */}
            <div className="product-list-header"> 
                <h1>CHECK THEM OUT!</h1>
                {/* My Orders Link/Button */}
                <button 
                    type="button" 
                    className="view-orders-btn"
                    onClick={handleViewOrders}
                >
                    My Orders
                </button>
            </div>
            
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product._id} className="product-card">
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="product-image"
                        />
                        
                        <div className="product-details">
                            
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3> 
                                
                                {/* Using ₹ symbol for currency display */}
                                <p className="product-price">PRICE: ₹{product.price.toFixed(2)}</p> 
                                
                                <p className="product-category">Category: {product.category}</p>
                                <p className="product-stock">Stock: {product.stock}</p>
                            </div>
                            
                            {/* Buy Now Button */}
                            <button 
                                type="button" // Important for preventing unwanted form submission
                                disabled={product.stock === 0} 
                                className="buy-btn"
                                onClick={() => handleBuyNow(product)} 
                            >
                                {product.stock > 0 ? 'Buy now' : 'Out of Stock'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;