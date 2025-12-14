// pages/MyOrders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError } from '../utils'; 
import './MyOrders.css';

function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // BACKEND ENDPOINT
    const url = 'https://invictus-api.vercel.app/api/orders/my-orders'; 

    useEffect(() => {
        if (!token) {
            handleError("Session expired. Please log in.");
            navigate('/login'); 
            return;
        }

        const fetchOrders = async () => {
            try {
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `${token}` 
                    }
                });
                const result = await response.json();

                if (response.ok) {
                    setOrders(result.orders);
                } else if (response.status === 401 || response.status === 403) {
                    handleError(result.message || 'Access denied. Please log in again.');
                    localStorage.removeItem('token');
                    navigate('/login');
                } else {
                    handleError(result.message || 'Failed to fetch orders.');
                }
            } catch (error) {
                handleError('Network error: Could not connect to the server.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [token, navigate]);

    if (loading) {
        return <div className="orders-message">Loading your order history...</div>;
    }

    const formatPrice = (amountInCents) => {
        // Convert from cents (stored in DB) back to dollars/rupees
        return (amountInCents / 100).toFixed(2);
    }
    
    return (
        <div className="orders-container">
            <h1 className="orders-title">MY ORDER HISTORY</h1>
            
            {orders.length === 0 ? (
                <div className="orders-message">You haven't placed any orders yet.</div>
            ) : (
                <div className="orders-list">
                    {orders.map((order) => (
                        <div key={order._id} className="order-card">
                            <div className="order-header">
                                <span className="order-id">Order ID: {order._id.slice(-8)}</span>
                                <span className={`order-status status-${order.status}`}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="order-body">
                                <p className="order-name">{order.productName}</p>
                                <p className="order-price">
                                    Total Paid: ₹{formatPrice(order.amountPaid)}
                                </p>
                                <p className="order-date">
                                    Date: {new Date(order.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyOrders;