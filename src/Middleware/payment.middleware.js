const { MercadoPagoConfig, Preference } = require('mercadopago');

const createOrder = async (req, res) => {
    try {
        //CONFIG SELL 
        const client =  new MercadoPagoConfig({
            accessToken: "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919",
            options: { timeout: 5000, idempotencyKey: "abc" }
        });
         console.log(client , "token vendedor")
        //DATA BUY
        const body = {
           items:[{
               title: "Laptop",
               quantity : 1,
               unit_price : 200,
               currency_id : "ARS"
           }],
           back_urls: {
            success: "https://www.youtube.com/@onthecode",
            failure: "https://www.youtube.com/@onthecode",
            pending : "https://www.youtube.com/@onthecode"
           },
           auto_return: "approved"
        };
        // CREATE PREFERENCE
        const preference = new Preference(client)
        //CREATE PAYMENT
        const result = await preference.create({body})
        console.log("Pedido creado exitosamente😁:", result);
        res.status(200).json({
            id: result.id
        });
    } catch (error) {
        console.error("error!😓:", error);
        // res.status(500).json({ message: error })
    }
};

module.exports = { createOrder };
