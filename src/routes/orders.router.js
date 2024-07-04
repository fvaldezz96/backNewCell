const { Router } = require('express');
const { getOrders, userOrders, obtenerOrderById } = require('../Middleware/getOrders');
const { Order } = require("../db")

const router = Router();

router.get("/", async (req, res) => {
  const filters = req.query;
  let condition = {}

  try {
    if (Object.keys(filters).length === 0) {
      const orders = await getOrders();
      return res.send(orders)
    }

    for (key in filters) {
      condition[key] = filters[key]
    }
    let orders = await Order.findAll({ include: [{ all: true }], where: condition })

    return res.send(orders)
  }
  catch (error) { next(error.message); console.log(error.message) }
})

router.get('/user/:userIdName', userOrders);
//ESTE GET NO ME TRAE EL ID DE LA ORDEN 
router.get('/id/:id_Orders', async (req, res, next) => {
  let { id_Orders } = req.params;
  console.log('id_Orders params /id/:id_Orders', id_Orders)
  try {
    let order = await obtenerOrderById(id_Orders)
    // console.log('result order(/id/:id_Orders):', order)
    return res.send(order)
  } catch (error) {
    next(error);
    console.log(error)
  }
})

router.put('/:id_Orders', async (req, res, next) => {
  let { userMail, date, payment, subTotal, paid, status } = req.body
  let { id_Orders } = req.params;
  // console.log('id Orders and req.body:', id_Orders, req.body)
  try {
    await Order.update(
      { userMail, date, payment, subTotal, paid, status },
      { where: { id_Orders } }
    )

    return res.status(200).json("Order updated")

  }
  catch (error) { next(error) }
})
module.exports = router;