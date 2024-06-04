const { Router } = require('express')
const { createOrder } = require("../Middleware/payment.middleware")
const router = Router();

router.get('/', createOrder)


module.exports = router