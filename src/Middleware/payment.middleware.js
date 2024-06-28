const { MercadoPagoConfig, Preference } = require('mercadopago');
const dotenv = require('dotenv');
dotenv.config()
const { Order } = require('../db');
const accessToken = process.env.ACCESS_TOKEN || "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919";
const createOrder = async (req, res) => {
    const client = new MercadoPagoConfig({
        accessToken: accessToken,
        options: { timeout: 5000, idempotencyKey: "abc" }
    });
    try {
        const {
            title,
            quantity,
            unit_price,
            currency_id,
            userIdName,
            mail,
            arr,
            name
        } = req.body;
        // let resultCarrito = arr
        // console.log(resultCarrito)
        if (!title || !quantity || !unit_price || !currency_id) {
            return res.status(406).send("missing fields");
        }
        const itemsArray = arr.map((item) => ({
            title: item.title,
            quantity: Number(item.quantity),
            unit_price: Number(item.price),
            currency_id: currency_id,
            description: item.description,
            id: item.id
        }))
        const body = {
            items: itemsArray,
            back_urls: {
                success: "https://n2bg9n4s-3000.brs.devtunnels.ms/",
                failure: "https://n2bg9n4s-3000.brs.devtunnels.ms/",
                pending: "https://n2bg9n4s-3000.brs.devtunnels.ms/"
            },
            notification_url: "https://n2bg9n4s-3001.brs.devtunnels.ms/webhook",
            payer: {
                name: name,
                email: mail
            }
        };
        const preference = new Preference(client);
        const result = await preference.create({ body });
        console.log('resultado body create order', result)
        res.status(200).json({ id: result.id });
    } catch (error) {
        console.error("error!😓:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createOrder };
