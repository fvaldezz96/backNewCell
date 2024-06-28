// const { cache } = require('../Middleware/webhook.middleware');
const { Order, Cell } = require('../db');

const validateAndCreateOrder = async (req, res) => {
    const paymentInfo = req.body;
    console.log("data from paymentInfo", paymentInfo)
    const unitData = () => {
        const dataArchive = []
        if (paymentInfo.arr) {
            const arr = paymentInfo.arr;
            const unit_price = paymentInfo.unit_price;
            const mail = paymentInfo.mail;
            const userIdName = paymentInfo.userIdName;
            const resultDataCell = dataArchive.push(arr, unit_price, mail, userIdName)
            console.log("result data cell console.log:", resultDataCell)
            resultDataCell;
        }
    }
    try {
        if (paymentInfo && paymentInfo.type === 'payment' || paymentInfo.topic === 'merchant_order') {
            const data = unitData()
            console.log("data unitData()", data)
            // data.map((e) => {
            //     const order = await Order.create({
            //         id_Orders: paymentInfo.data.id,
            //         payment: 'mercadopago',
            //         subTotal: unit_price,
            //         paid: true,
            //         userMail: mail,
            //     });
            //     userId: userIdName
            // })

            // const idCell = arr.map((e) => e.id);
            // const cell = await Cell.findAll({ where: { id: idCell } });

            // await order.addCell(cell);

            // console.log("Order created!");
            res.status(200).json({ message: "Order created successfully" });
        }
    } catch (error) {
        console.error("Error creating order:", error);
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { validateAndCreateOrder };
