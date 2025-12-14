// src/components/PaymentForm.jsx
import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';

const PaymentForm = ({ clientSecret, orderDetails, token }) => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        if (!stripe || !elements) {
            handleError("Payment interface is still loading. Please wait a moment.");
            return;
        }

        setIsProcessing(true);

        try {
            // CRITICAL FIX: Call elements.submit() for client-side validation
            const { error: submitError } = await elements.submit();

            if (submitError) {
                handleError(submitError.message);
                setIsProcessing(false);
                return;
            }

            // Confirm the payment
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                clientSecret, 
                redirect: 'if_required', 
            });

            if (error) {
                handleError(error.message);
                setIsProcessing(false);
                return;
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                await finalizeOrder(paymentIntent.id);
            } else {
                handleError(`Payment failed with status: ${paymentIntent.status}`);
                setIsProcessing(false);
            }
        } catch (e) {
            console.error("Error during payment confirmation:", e);
            handleError("An unexpected error occurred during payment processing.");
            setIsProcessing(false);
        }
    };

    const finalizeOrder = async (paymentIntentId) => {
        try {
            const url = 'https://invictus-api.vercel.app/api/orders/complete-order';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`, 
                },
                body: JSON.stringify({
                    productId: orderDetails.productId,
                    amount: orderDetails.amount,
                    paymentIntentId: paymentIntentId,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                handleSuccess(result.message);
                navigate('/products');
            } else {
                handleError(result.message || 'Order processing failed on server.');
            }
        } catch (error) {
            handleError('Network error during order completion.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        // Applies theme and layout from CheckoutPage.css
        <form onSubmit={handleSubmit} className="payment-form-card"> 
            <h2 className="payment-title">Paying for {orderDetails.productName}</h2>
            <p className="payment-amount">Amount: ₹{orderDetails.amount.toFixed(2)}</p>
            
            <PaymentElement className="stripe-payment-element" /> 

            <button 
                type="submit" 
                disabled={isProcessing || !stripe || !elements} 
                className="submit-payment-btn" 
            >
                {isProcessing ? "Processing..." : `Pay ₹${orderDetails.amount.toFixed(2)}`}
            </button>
        </form>
    );
};

export default PaymentForm;
