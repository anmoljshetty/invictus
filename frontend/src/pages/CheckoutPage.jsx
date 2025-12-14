// src/pages/CheckoutPage.jsx 
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm'; 
import { handleError } from '../utils';

import './CheckoutPage.css'; // 🔥 IMPORTED CSS

// Load Stripe outside of the component render to avoid recreation
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

function CheckoutPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { product } = location.state || {}; 
    
    const [clientSecret, setClientSecret] = useState(null);
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!product || !token) {
            handleError('Missing product details or authentication.');
            navigate('/products');
            return;
        }

        const createIntent = async () => {
            try {
                const url = 'http://localhost:8080/api/orders/create-payment-intent';
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    },
                    body: JSON.stringify({
                        productId: product._id,
                        amount: product.price,
                    }),
                });

                const result = await response.json();

                if (response.ok) {
                    setClientSecret(result.clientSecret);
                    setOrderDetails({
                        productId: product._id,
                        productName: product.name,
                        amount: product.price,
                    });
                } else {
                    handleError(result.message || 'Failed to initialize payment.');
                    navigate('/products');
                }
            } catch (error) {
                handleError('Network error during payment setup.');
                navigate('/products');
            } finally {
                setLoading(false);
            }
        };

        createIntent();
    }, [product, token, navigate]);

    if (loading || !product) {
        // Apply theme classes to loading/error states
        return <div className="checkout-container"><div className="checkout-loading">Preparing your order...</div></div>;
    }

    if (!clientSecret) {
        // Apply theme classes to loading/error states
        return <div className="checkout-container"><div className="checkout-error">Could not load payment interface.</div></div>;
    }

    const options = {
        clientSecret,
        appearance: { theme: 'night' }, 
    };

    return (
        <div className="checkout-container">
            <h1 className="checkout-title">SECURE CHECKOUT</h1>
            
            {/* Stripe Elements Provider */}
            <Elements options={options} stripe={stripePromise}>
                {/* PaymentForm will apply its own styled container */}
                <PaymentForm clientSecret={clientSecret} orderDetails={orderDetails} token={token} />
            </Elements>
        </div>
    );
}

export default CheckoutPage;