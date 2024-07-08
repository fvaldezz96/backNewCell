const dotenv = require('dotenv');
const { Order, Cell } = require('../db');
const transportator = require('../nodemailer/configurations');
const fetch = require('node-fetch');
dotenv.config();

const webHooksFunction = async (req, res) => {
    try {
        const data = req.body;
        if (data.action === 'payment.created') {
            // JSON MERCADOPAGO
            const orderID = data.data.id;
            const ACCESS_TOKEN = "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919";
            const paymentDetailsURL = `https://api.mercadopago.com/v1/payments/${orderID}?access_token=${ACCESS_TOKEN}`;
            const paymentDetailsResponse = await fetch(paymentDetailsURL);
            const paymentDetailsJson = await paymentDetailsResponse.json();

            // VALIDATIONS
            if (paymentDetailsJson.status !== 'approved') {
                return res.status(400).json({ message: 'Order not approved🥵' });
            }

            let cell;
            const idCell = paymentDetailsJson.additional_info?.items.map(item => item.id);
            let arr = paymentDetailsJson.additional_info?.items;
            // console.log('arr paymentDetailsJson.additional_info?.items:', arr)
            const resultIdCell = parseInt(idCell);

            // EMAIL NODEMAILER
            const email = `
                <!DOCTYPE html>
                <html>
                    <head>
                        <link rel="preconnect" href="https://fonts.googleapis.com">
                        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                        <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;900&family=Righteous&display=swap" rel="stylesheet">
                        <style>
                            .img {
                                max-width: 100px;
                                border-radius: 25%;
                            }
            
                            h1, h2, h3, p {
                                text-align: center;
                                font-family: 'Lato', sans-serif;
                                font-family: 'Righteous', cursive;
                            }
                            .image {
                                background-color: rgb(31, 31, 31);
                                text-align: center;
                            }
            
                            .information {
                                background-color: rgb(211, 211, 211);
                                height: 50px;
                                text-align: center;
                                justify-content: center;
                            }
            
                            .refound {
                                display: flex;
                                align-items: center;
                                background-color: aliceblue;
                                height: 100PX;
                                color: rgb(141, 141, 141);
                            }
                            .title{
                                color:white;
                            }
                        </style>
                    </head>
                    <body>
                        <div>
                            <div class="image">
                                <h2 class="title">E-COMMERCE</h2>
                            </div>
                            <h1>Thanks!</h1>
                            <hr></hr>
                            <div class="refound">
                                <p>
                                   Gracias por tu compra! Tu producto esta en camino!!😁</a>.
                                </p>
                            </div>
                        </div>
                    </body>
                </html>
                `;

            try {
                const existingOrder = await Order.findOne({ where: { id_Orders: paymentDetailsJson.order.id } });
                if (existingOrder) {
                    return res.status(400).json({ message: 'Order already exists🥵' });
                }

                // CREATE ORDER
                const createOrder = await Order.create({
                    id_Orders: paymentDetailsJson.order.id,
                    payment: 'mercadopago',
                    userMail: paymentDetailsJson.payer.email,
                    subTotal: paymentDetailsJson.transaction_amount,
                    paid: true,
                    userId: paymentDetailsJson.metadata.user_id,
                    status: 'pagado'
                });

                // SEARCH ID PRODUCT
                cell = await Cell.findAll({ where: { id: resultIdCell } });
                // console.log('cell result findAll():', cell[0].stock)
                await createOrder.addCell(cell);

                for (let i = 0; i < cell.length; i++) {
                    for (let j = 0; j < arr.length; j++) {
                        if (String(cell[i].id) === arr[j].id) {
                            cell[i].stock -= Number(arr[j].quantity);
                        }
                    }
                }
                await Promise.all(cell.map(async (e) => {
                    await Cell.update({ stock: e.stock }, { where: { id: e.id } });
                    // console.log(`Successfully updated stock for cell ID: ${e.id}. New Stock: ${e.stock}`);
                }));
                // NODEMAILER
                await transportator.sendMail({
                    from: '"Thanks for Buy In Producto Store 😁" <buddy73@ethereal.email>',
                    to: paymentDetailsJson.payer.email,
                    subject: `Your receipt of Cell Store ${paymentDetailsJson.metadata.user_id} 🧾`,
                    html: email
                });
                return res.status(200).json({ message: "Successful Payment, stock changed and email sent !!😁" });
            } catch (err) {
                console.log('Marchant Order...');
                return res.status(200).send('Marchant Order...')
            }
        } else {
            return res.status(200).send('Order not payment!...')
        }
    } catch (error) {
        console.error('Error handling webhook notification:', error);
        return res.status(500).json({ message: 'Error handling webhook notification' });
    }
};

module.exports = { webHooksFunction };
