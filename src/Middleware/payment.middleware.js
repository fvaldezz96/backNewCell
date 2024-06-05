const { MercadoPagoConfig, Preference } = require('mercadopago');
const dotenv = require('dotenv');
const env = dotenv.config();
const ACCES_TOKEN = process.env.ACCES_TOKEN; 
const { Cell, Order } = require('../db');
const transportator = require("../nodemailer/configurations");

const createOrder = async (req, res) => {
    //CONFIG SELL 
    //DATOS DE VENDEDOR
    const client =  new MercadoPagoConfig({
        accessToken: ACCES_TOKEN, //cambie el token por la variable
        options: { timeout: 5000, idempotencyKey: "abc" }
    });
    try {
        const {title, quantity , unit_price, currency_id, id, amount, mail, arr, userIdName} = req.body
        if (!id || !amount || !mail || !arr || !userIdName) {
            res.status(406).send("missing fields")
        }
        let cell
        // Line
        const idCell = arr.map(c => c.id);
        const data = arr.map(c => {
            "Model :" + c.model + " Line: " + c.line
        })
        
        //DATA BUY
        const body = {
           items:[{
               title: title,
               quantity : Number(quantity),
               unit_price : Number(unit_price),
               currency_id : currency_id
           }],
           back_urls: {
            success: "https://fede-valdez.vercel.app/",
            failure: "https://fede-valdez.vercel.app/",
            pending : "https://fede-valdez.vercel.app/"
           },
           notification_url:"http://localhost:3001/webhook"
           //auto_return: "approved"
        };
        // CREATE PREFERENCE
        const preference = new Preference(client)
        if(preference){
            const result = await preference.create({body})
            console.log("Preferencia creada😁,ID usuario:", result.id);
            res.status(200).json({ id: result.id });
        }else {
            res.status(400).json({message : "error Prefence!😒"})
        }
        try {
            let order = await Order.create({
                id_Orders: id,
                payment: 'card',
                subTotal: amount,
                paid: true,
                userMail: mail,
                userId: userIdName
            })
            cell = await Cell.findAll({ where: { id: idCell } })
            await order.addCell(cell);
        } catch (err) {
            console.log(err)
            res.status(404).json(err);
        }
        //GMAIL DE LA EMPREZA 
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
                        <h2 class="title">CELL STORE</h2>
                    </div>
                    <h1>Thanks!</h1>
                    <h3>Hi ${mail} 👋</h3>
                    <p>Thanks for your purchase from Cell Store</p>
             
                    <hr></hr>
                    <div class="information">
                        <h2>INFORMATION ABOUT YOUR ORDER:</h2>
                    </div>
                    <hr></hr>
                    <h3>Billed to: ${mail}</h3>
                    <h3>Font: Cell Store</h3>
                    <h3>Products: </h3>
                    <div>
                    <p>${data}</p>
                    </div>
                    <hr></hr>
                    <h3>Total [USD]: $${amount}</h3>
                    <hr></hr>
                    <div class="refound">
                        <p>
                            Unless otherwise stated by the product or offer, any cell purchased from the Cell Store is eligible for a refund within 14 days of purchase (or, for pre-orders, upon release) if you played less than 2 hours. See more information in our <a href="">refund policy</a>.
                        </p>
                    </div>
                </div>
            </body>
        </html>
        `;
        transportator.sendMail({
            from: '"Thanks For Buy In Cell Store 👻"<sender@server.com>',
            to: mail,
            subject: `Your receipt of Cell Store ${userIdName} 🧾`,
            html: email
        })
        cell
        arr
        Cell
        for (let i = 0; i < cell.length; i++) {
            for (let j = 0; j < arr.length; j++) {
                if (cell[i].id === arr[j].id) {
                    cell[i].stock -= arr[j].quantity
                }
            }
        }
        //CAMBIA EL STOCK LUEGO DE LA COMPRA
        cell.forEach(e => {
            Cell.update({ stock: e.stock }, { where: { id: e.id } })
        });
        res.status(200).json({ message: "Successful Payment 😁" });
        //CREATE PAYMENT
    } catch (error) {
        console.error("error!😓:", error);
        res.status(500).json({ message: error })
    }
};

const receiveWebhook = (req, res) => {
    
}

module.exports = { createOrder, receiveWebhook };
