const { MercadoPagoConfig, Payment } = require('mercadopago');

const createOrder = async (req, res, next) => {
    try {
        //CONFIG VENDEDOR 
        const client = new MercadoPagoConfig({
            accessToken: "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919",
            options: { timeout: 5000, idempotencyKey: "abc" }
        });
        // console.log("data vendendor", client)
        // if (client.accessToken != null) {
        const payment = new Payment(client);
        console.log("payment res:", payment)
        //DATA COMPRADOR
        const body = {
            transaction_amount: 100,
            description: "Laptop",
            payment_method_id: "master",
            payer: {
                email: "test_user_570485273@testuser.com"
            }
        };

        // CREATE PAYMENT
        const response = await payment.create({ body });
        console.log("Pedido creado exitosamente😁:", response);
        res.status(200).json("Order create", { response });
        // } else {
        //     res.status(400).json({ message: "tokend failed" })
        // }
    } catch (error) {
        console.error("error!😓:", error);
        res.status(500).json({ message: error })
    }
};

module.exports = { createOrder };


// transactionAmount: 1000,
// token: "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919",
// installments: 1,
// paymentMethodId: "visa",
// issuerId: "123",
// payer: {
//     email: "string",
//     identification: {
//         type: "string",
//         number: "string"
//     },
//     name: "string",
//     surname: "string"
// },
// description: "string",
// statementDescriptor: "string",
// metadata: {
//     custom_id: "string"
// },
// binaryMode: true