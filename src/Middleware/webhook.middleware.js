const express = require('express');
const { verifyWebhook } = require('mercadopago');
const dotenv = require('dotenv');
const { Cell, Order } = require('../db');
const transportator = require("../nodemailer/configurations");
const env = dotenv.config();

const accessToken = 'TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919';

const webHooksFunction = async (req, res) => {
    try {
        const verified = await verifyWebhook(req, accessToken);
        if (!verified) {
            console.error('Invalid webhook received');
            res.status(400).json({ message: 'Invalid webhook' });
            return;
        }
        const data = JSON.parse(req.body);
        const paymentId = data.data.id;
        const paymentStatus = data.data.status;
        console.log("id user webhook:", paymentId, "paymentStatus response:", paymentStatus)
        handlePaymentStatusUpdate(paymentId, paymentStatus);
        res.status(200).json({ message: 'Webhook processed successfully 😁' });
    } catch (error) {
        console.error('Error processing webhook:', error);
        res.status(500).json({ message: 'Error processing webhook 😓' });
    }
};
// Function to handle payment status update (implement your logic here)
function handlePaymentStatusUpdate(paymentId, paymentStatus) {
    // Example logic:
    switch (paymentStatus) {
        case 'approved':
            // Update order status to "paid"
            // Send confirmation email to the customer
            break;
        case 'pending':
            // Update order status to "pending"
            // Notify the customer that their payment is being processed
            break;
        // ... handle other payment statuses
    }
}

module.exports = { webHooksFunction, handlePaymentStatusUpdate };
