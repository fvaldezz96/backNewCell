const { Order } = require("../db")

const getOrders = async (req, res) => {
  try {
    let orders = await Order.findAll({
      include: [{
        all: true,
      }]
    })
    return orders;
  } catch (error) {
    console.log('error en Get orders', error)
  }
}

const userOrders = async (req, res) => {
  let { userIdName } = req.params;
  // console.log('userIdName: userOrders()', userIdName)
  try {
    let orders = await Order.findAll({
      where: {
        userId: userIdName
      },
      include: [{
        all: true
      }]
    })
    res.send(orders);
  } catch (error) {
    console.log('error en order users', error)
  }
}

//BUSCA LOS ID DE LAS ORDENES
const obtenerOrderById = async (id_Orders) => {
  try {
    let orders = await Order.findAll({
      where: { id_Orders: id_Orders },
      include: [{
        all: true
      }]
    })
    console.log('obtenerOrderById() => ', orders)
    return orders
  } catch (error) {
    console.log('error en order users', error)
  }
}
module.exports = { getOrders, userOrders, obtenerOrderById }