const { MercadoPagoConfig, Preference } = require('mercadopago');
const dotenv = require('dotenv');
const env = dotenv.config();
const ACCES_TOKEN = process.env.ACCES_TOKEN;
const { Cell, Order } = require('../db');
const transportator = require("../nodemailer/configurations");
const { webHooksFunction } = require('../Middleware/webhook.middleware')

const accessToken = "TEST-6485417490730016-060314-f1c8312c6a1e63a3757ab341a14482fd-1839867919"
const createOrder = async (req, res) => {
    const client = new MercadoPagoConfig({
        accessToken: accessToken,
        options: { timeout: 5000, idempotencyKey: "abc" }
    });
    try {
        const { title, quantity, unit_price, currency_id, userIdName, mail, arr, name } = req.body
        console.log("data front-end body", req.body)
        if (!title || !quantity || !unit_price || !currency_id) res.status(406).send("missing fields😁")
        if (title || quantity || unit_price || currency_id) {

            let cell
            const idCell = arr.map((e) => { e.id })
            const data = arr.map((e) => {
                return "Model: " + e.model + " Line: " + e.line
            })

            const body = {
                items: [{
                    title: title,
                    quantity: Number(quantity),
                    unit_price: Number(unit_price),
                    currency_id: currency_id
                }],
                back_urls: {
                    success: "https://n2bg9n4s-3000.brs.devtunnels.ms/",
                    failure: "https://n2bg9n4s-3000.brs.devtunnels.ms/",
                    pending: "https://n2bg9n4s-3000.brs.devtunnels.ms/"
                },
                notification_url: "https://n2bg9n4s-3001.brs.devtunnels.ms/webhook",
                player: {
                    name: name,
                    email: mail
                }
            };
            // CREATE PREFERENCE
            const preference = new Preference(client)
            // console.log("new preference client API", preference)
            if (preference) {
                const result = await preference.create({ body })
                console.log("Preferencia creada😁, ID usuario:", result);
                res.status(200).json({ id: result.id });
            } else {
                res.status(400).json({ message: "error Prefence!😒" })
            }




            //TENGO QUE VER EL TEMA DE CREAR LA ORDEN UNA VES QEU LLEGUE EL ID DEL PAYMENT


            // const resultIdPayment = webHooksFunction()
            // console.log("resultado funtion webhook create Order: ", resultIdPayment)
            try {
                // if (resultIdPayment) {
                //QUEDA MANEJAR BIEN LOS DETALLES 
                const order = await Order.create({
                    id_Orders: resultIdPayment,
                    payment: 'mercadopago',
                    subTotal: unit_price,
                    paid: true,
                    userMail: mail,
                    userId: userIdName
                })
                cell = await Cell.findAll({ where: { id: idCell } })
                await order.addCell(cell)
                // } else {
                //     res.status(400).json({ message: "error Prefence!😒" })
                // }
            } catch (error) {
                console.log(error)
                res.status(404).json(error)
            }
        }
    } catch (error) {
        console.error("error!😓:", error);
        res.status(500).json({ message: error })
    }
};


module.exports = { createOrder };
