const { axios } = require('axios');
const dotenv = require('dotenv');
const { Order } = require('../db');
dotenv.config()

const webHooksFunction = async (req, res) => {
    try {
        const data = req.body;
        console.log('data req.body webHook', data)
        if (data.action === 'payment.created') {
            const orderID = data.data.id
            console.log('oderderID', orderID)
            const ACCESS_TOKEN = "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919"
            const paymentDetailsURL = `https://api.mercadopago.com/v1/payments/${orderID}?access_token=${ACCESS_TOKEN}`
            const paymentDetailsResponse = await fetch(paymentDetailsURL);
            const paymentDetailsJson = await paymentDetailsResponse.json();
            console.log('respuesta mercadopago json', paymentDetailsJson)
            if (paymentDetailsJson.status === 'approved') {
                let subTotal;
                if (paymentDetailsJson.items && paymentDetailsJson.items.length > 0) {
                    subTotal = paymentDetailsJson.items.map((price) => price.unit_price);
                } else {
                    console.warn('No items found in payment details');
                    subTotal = 0;
                }
                const temporaryOrder = await Order.create({
                    id_Orders: paymentDetailsJson.order.id,
                    userMail: paymentDetailsJson.payer.email,
                    payment: 'mercadopago',
                    subTotal: subTotal,
                    paid: true,
                });
                console.log('order creada correctamente', temporaryOrder);
                res.status(200).json({ message: 'Order Create!😁' });
            } else if (paymentDetailsJson.status !== 'approved') {
                console.log('Order failet:', paymentDetailsJson.status);
                res.status(400).json({ message: 'Order not approved🥵' });
            }
        } else if (data.action !== 'payment.created') {
            console.log('Order failet:', data.action);
            res.status(200).json({ message: 'Order not create!🥵' });
        }
    } catch (error) {
        console.error('Error handling webhook notification:', error);
        res.status(500).json({ message: 'Error handling webhook notification' });
    }
};

module.exports = { webHooksFunction };
