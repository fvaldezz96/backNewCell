const dotenv = require('dotenv');
const { Order, Cell } = require('../db');
const transportator = require('../nodemailer/configurations')
dotenv.config()

const webHooksFunction = async (req, res) => {
    try {
        const data = req.body;
        if (data.action === 'payment.created') {
            const orderID = data.data.id
            // console.log('oderderID', orderID)
            const ACCESS_TOKEN = "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919"
            const paymentDetailsURL = `https://api.mercadopago.com/v1/payments/${orderID}?access_token=${ACCESS_TOKEN}`
            const paymentDetailsResponse = await fetch(paymentDetailsURL);
            let paymentDetailsJson = await paymentDetailsResponse.json();
            /**
             * ACA SE ENCUENTRA LA LOGICA PARA TRAER LOS DATOS DEL CELULAR QUE SE ESTA COMPRANDO PARA HACER EL CAMBIO DEL 
             * STOCK EN EL SISTEMA Y LA DATA DEL MODELO 
             */
            // console.log('respuesta mercadopago json', paymentDetailsJson)
            if (paymentDetailsJson?.status !== 'approved') {
                // console.log('monto transaccion:', paymentDetailsJson.transaction_amount);
                res.status(400).json({ message: 'Order not approved🥵' });
            } else if (paymentDetailsJson.status === 'approved') {
                const createOrder = await Order.create({
                    id_Orders: paymentDetailsJson.order.id,
                    payment: 'mercadopago',
                    userMail: paymentDetailsJson.payer.email,
                    subTotal: paymentDetailsJson.transaction_amount,
                    paid: true,
                    userId: paymentDetailsJson.metadata.user_id
                });
                res.status(200).json({ message: 'Order Create!😁' });
            }
        } else if (data.action !== 'payment.created') {
            console.log('Orden en proceso...');
            res.status(200).json({ message: 'Order not create!🥵' });
        }
    } catch (error) {
        console.error('Error handling webhook notification:', error);
        res.status(500).json({ message: 'Error handling webhook notification' });
    }
};

module.exports = { webHooksFunction };
