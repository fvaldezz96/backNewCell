const { MercadoPagoConfig, Payment } = require('mercadopago');

const createOrder = async (req, res, next) => {
    try {
        //CONFIG VENDEDOR 
        const client = new MercadoPagoConfig({
            accessToken: "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919",
            options: { timeout: 5000, idempotencyKey: "abc" }
        });
        //console.log(client)
        const payment = new Payment(client);
        //DATA COMPRADOR
        const body = {
            transaction_amount: 400,
            description: "Laptop",
            payment_method_id: "card",
            payer: {
                email: "TEST-3f016ccf-a16d-42e1-8dee-92d23aabbe8f"
            }
        };
        //CREATE PAYMENT
        const response = await payment.create({ body });
        // Manejar la creación exitosa
        console.log("Pedido creado exitosamente:", response);
        res.send("Order create", response);

    } catch (error) {
        console.error("error!😓:", error);
        res.send(error)
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