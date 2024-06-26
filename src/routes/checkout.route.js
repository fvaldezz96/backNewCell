const { Router } = require('express');
const { Cell, Order } = require('../db');
const transportator = require("../nodemailer/configurations");
const { Stripe } = require('stripe');
const router = Router();
const stripe = new Stripe("sk_test_51PMHfrASv5AjWy9n6OQicrAvrT8wEGItpBWSj0TQ544k4nWr6dskxETap4Az3UFrYxhTLiek7AqKhxaaejWUthRN00oNnyTA0y")

router.post("/", async (req, res) => {
    try {
        const { id, amount, mail, arr, userIdName } = req.body;
        if (!id || !amount || !mail || !arr || !userIdName) {
            res.status(406).send("missing fields")
        }
        let cell
        // Line
        const idCell = arr.map(c => c.id);
        const data = arr.map(c => {
            return "Model :" + c.model + " Line: " + c.line
        })
        //EMAIL USERS 
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
        //SEND DATA STRIP CART
        await stripe.paymentIntents.create({
            amount: parseInt(amount),
            receipt_email: mail,
            currency: "USD",
            description: "Cell",
            payment_method: id,
            confirm: true,
            automatic_payment_methods: {
                enabled: true
            },
            return_url: 'http://localhost:3000/'
        });
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
        transportator.sendMail({
            from: '"Thanks For Buy In Cell Store 👻"<jillian.kertzmann9@ethereal.email>',
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

    } catch (error) {
        console.log(error)
        res.status(404).json(error);
    }
})

module.exports = router