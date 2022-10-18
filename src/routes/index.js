const { Router } = require('express');

const brand = require('./marca.route')
const cell = require('./celular.route')
const user = require('./user.route')
const checkout = require("./checkout.route")
const question = require('./question.route')
const rating = require('./rating.router')
const sendClaimMail = require('./sendClaimMail')
const ordersRouter = require('./orders.router')
const cart = require('./cart.route')

const router = Router()

router.use('/celulares', cell)
router.use('/marcas', brand)
router.use('/users', user)
router.use('/checkout', checkout)
router.use('/questions', question)
router.use('/rating', rating)
router.use('/send-claim', sendClaimMail)
router.use('/orders', ordersRouter)
router.use('/cart', cart)


module.exports = router;
